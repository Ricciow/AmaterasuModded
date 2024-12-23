import { Animations, AspectConstraint, CenterConstraint, ConstantColorConstraint, OutlineEffect, RelativeConstraint, SubtractiveConstraint, UIRoundedRectangle, UIText, animate } from "../../Elementa"
import ElementUtils from "../../DocGuiLib/core/Element"
import SliderElement from "../../DocGuiLib/elements/Slider"
import { getMagnitudeScale } from "../utils"

export default class SliderElementFix extends SliderElement {
    /**
     * @param {[Number, Number, Number]} settings [Min, Max, Starting Value]
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width The width in pixels
     * @param {Number} height 
     */
    constructor(settings = [ 0, 10 ], defaultValue = 1, x, y, width, height, outline = false) {
        super(settings, defaultValue, x, y, width, height, outline)

        this.sliderBoxHeight = 15

        this.initialPercent = ElementUtils.miniMax(0, 1, (this.defaultValue-this.settings[0]) / (this.settings[1]-this.settings[0])) //Math mistake fix

        this.initialX = this.initialPercent !== 0 ? new SubtractiveConstraint(new RelativeConstraint(this.initialPercent), ((this.sliderBoxHeight/2)).pixels()) : (-(this.sliderBoxHeight/2)).pixels()
        this.focused = false
        this.value = this.settings[0] % 1 !== 0
            ? parseFloat(this.defaultValue).toFixed(2)
            : parseInt(this.defaultValue)

        this.nudgeScale = this.settings[0] % 1 !== 0 //Set nudge to fit numbers
            ? Math.max(0.01, Math.pow(10, getMagnitudeScale(this.settings[1])-1))
            : Math.max(1, Math.pow(10, getMagnitudeScale(this.settings[1])-1))
    }

    _create(colorScheme = {}) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)

        // If the previously saved default value was under/over the min/max
        // we call the [onMouseRelease] event so it gets adjusted to the new value
        if (this.rawDefaultValue < this.settings[0] || this.rawDefaultValue > this.settings[1]) {
            this._triggerEvent(this.onMouseRelease, this.defaultValue)
        }

        this.backgroundBox = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("background", "color"))
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))

        this.sliderBar = new UIRoundedRectangle(this._getSchemeValue("bar", "roundness"))
            .setX(new CenterConstraint)
            .setY(new CenterConstraint())
            .setWidth(new SubtractiveConstraint((98).percent(), (this.sliderBoxHeight).pixels()))
            .setHeight((10).pixels())
            .setColor(this._getColor("bar", "color"))
            .enableEffect(new OutlineEffect(this._getColor("bar", "outlineColor"), this._getSchemeValue("bar", "outlineSize")))
            .setChildOf(this.backgroundBox)

        this.compBox = new UIRoundedRectangle(this._getSchemeValue("completionbar", "roundness"))
            .setWidth(new RelativeConstraint(this.initialPercent))
            .setHeight((100).percent())
            .setColor(this._getColor("completionbar", "color"))
            .enableEffect(new OutlineEffect(this._getColor("completionbar", "outlineColor"), this._getSchemeValue("completionbar", "outlineSize")))
            .setChildOf(this.sliderBar)
        
        this.sliderBox = new UIRoundedRectangle(this._getSchemeValue("sliderbox", "roundness"))
            .setX(this.initialX)
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((this.sliderBoxHeight).pixels())
            .setColor(this._getColor("sliderbox", "color"))
            .enableEffect(new OutlineEffect(this._getColor("sliderbox", "outlineColor"), this._getSchemeValue("sliderbox", "outlineSize")))
            .setChildOf(this.sliderBar)
        
        this.sliderValue = new UIText(this.defaultValue)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((this._getSchemeValue("text", "scale").pixels()))
            .setColor(this._getColor("text", "color"))
            .setChildOf(this.sliderBox)

        // Slider events
        // Taking the same approach as [https://github.com/EssentialGG/Vigilance/blob/master/src/main/kotlin/gg/essential/vigilance/gui/settings/Slider.kt]
        // since the slider was flickering a lot with the previous code
        this.sliderBar
            .onMouseClick(this._onMouseClick.bind(this))
            .onMouseRelease(this._onMouseRelease.bind(this))
            .onMouseDrag(this._onMouseDrag.bind(this))

        this.backgroundBox
            .onMouseClick(this._onMouseClick.bind(this))
            .onMouseRelease(this._onMouseRelease.bind(this))
            .onMouseDrag(this._onMouseDrag.bind(this))
            .onFocus(this._onFocus.bind(this))
            .onFocusLost(this._onFocusLost.bind(this))
            .onKeyType(this._onKeyType.bind(this))

        this.sliderBox
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseEnterAnimation", "type")],
                        this._getSchemeValue("mouseEnterAnimation", "time"),
                        new ConstantColorConstraint(this._getColor("mouseEnterAnimation", "color")),
                        0
                        )
                })
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseLeaveAnimation", "type")],
                        this._getSchemeValue("mouseLeaveAnimation", "time"),
                        new ConstantColorConstraint(this._getColor("mouseLeaveAnimation", "color")),
                        0
                        )
                })
            })
        return this.backgroundBox
    }

    _onMouseClick(component, event) {
        super._onMouseClick(component, event)
        this.backgroundBox.grabWindowFocus()
    }

    _onMouseDrag(component, x, y, button) {
        if (!this.isDragging) return

        // Cancel the custom event for this component
        if (this._triggerEvent(this.onMouseDrag, x, y, button, component, this.getValue()) === 1 || !this.offset) return
        
        const clamped = (x + component.getLeft()) - this.offset                                                                                                                                            
        const roundNumber = ElementUtils.miniMax(this.sliderBar.getLeft(), this.sliderBar.getRight(), clamped)                                                                                            
        const percent = ElementUtils.miniMax(0, 1, (roundNumber - this.sliderBar.getLeft()) / this.sliderBar.getWidth())                                                                                   

        this.setPercentage(percent)
    }

    _onFocus(component) {
        this.focused = true
    }

    _onFocusLost(component) {
        this.focused = false
    }

    _onKeyType(component, char, keycode) {
        switch (keycode) {
            case 208: // Pressed down arrow key
            case 31:  // Pressed S
                this.nudgeScale = this.settings[0] % 1 !== 0
                    ? Math.max(0.01, this.nudgeScale / 10)
                    : Math.max(1, this.nudgeScale/10)
                break;
            case 200: // Pressed up arrow key
            case 17:  // Pressed W
                this.nudgeScale *= 10
                break;
            case 203: // Pressed left arrow key
            case 30:  // Pressed A
                this.setValue(parseFloat(this.value)-1*this.nudgeScale)
                break;
            case 205: // Pressed right arrow key
            case 32:  // Pressed D
                this.setValue(parseFloat(this.value)+1*this.nudgeScale)
                break;
        }
    }

    setValue(value) {
        const percentage = ElementUtils.miniMax(0, 1, (value-this.settings[0]) / (this.settings[1]-this.settings[0]))
        const newValue = ElementUtils.miniMax(this.settings[0], this.settings[1], value)
        this.value = this.settings[0] % 1 !== 0
            ? parseFloat(newValue).toFixed(2)
            : parseInt(newValue)
        this.sliderValue.setText(this.value)
        this.sliderBox.setX(new SubtractiveConstraint(new RelativeConstraint(percentage), ((this.sliderBoxHeight/2)).pixels()))
        this.compBox.setWidth(new RelativeConstraint(percentage))
    }

    /**
     * Sets the percentage of this slider
     * @param {Float} percentage 
     */
    setPercentage(percentage) {
        percentage = ElementUtils.miniMax(0, 1, percentage)
        
        this.value = this.settings[0] % 1 !== 0
            ? parseFloat(((this.settings[1] - this.settings[0]) * ((percentage * 100) / 100) + this.settings[0])).toFixed(2)
            : parseInt((this.settings[1] - this.settings[0]) * ((percentage * 100) / 100) + this.settings[0])

        this.sliderValue.setText(this.value)
        this.sliderBox.setX(new SubtractiveConstraint(new RelativeConstraint(percentage), ((this.sliderBoxHeight/2)).pixels()))
        this.compBox.setWidth(new RelativeConstraint(percentage))
    }
}