import MultiCheckbox from "../../DocGuiLib/elements/MultiCheckbox"
import { UIRoundedRectangle, OutlineEffect, CenterConstraint, UIWrappedText, UIText, CramSiblingConstraint, ScrollComponent} from "../../Elementa"
import ElementUtils from "../../DocGuiLib/core/Element"
import CheckboxFix from "./CheckboxFix"

export default class MultiCheckboxFix extends MultiCheckbox {
    constructor(options = [], placeholder = "Click", x, y, width, height) {
        super(options, placeholder, x, y, width, height)
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.bgBox = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("background", "color"))
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))

        this.textBgBox = new UIRoundedRectangle(this._getSchemeValue("placeholderbackground", "roundness"))
            .setX((1).pixels())
            .setY(new CenterConstraint())
            .setWidth((75).percent())
            .setHeight((100).percent())
            .setColor(this._getColor("placeholderbackground", "color"))
            .enableEffect(new OutlineEffect(this._getColor("placeholderbackground", "outlineColor"), this._getSchemeValue("placeholderbackground", "outlineSize")))
            .setChildOf(this.bgBox)

        this.placeholderText = new UIWrappedText(this.placeholder, true, null, true, true, 10)
            .setX((1).pixels())
            .setY((new CenterConstraint()))
            .setWidth((100).percent())
            .setColor(this._getColor("placeholdertext", "color"))
            .setTextScale((this._getSchemeValue("placeholdertext", "scale")).pixels())
            .setChildOf(this.textBgBox)

        this.arrowText = new UIText(this._getSchemeValue("text", "openArrow"))
            .setX(new CramSiblingConstraint(5))
            .setY(new CenterConstraint())
            .setColor(this._getColor("text", "color"))
            .setTextScale((this._getSchemeValue("text", "scale")).pixels())
            .setChildOf(this.bgBox)

        this.dropDownBg = new UIRoundedRectangle(this._getSchemeValue("dropdownbackground", "roundness"))
            .setX(new CenterConstraint())
            .setY(new CramSiblingConstraint(5))
            .setWidth((200).percent())
            .setHeight((600).percent())
            .enableEffect(new OutlineEffect(this._getColor("dropdownbackground", "outlineColor"), this._getSchemeValue("dropdownbackground", "outlineSize")))
            .setColor(this._getColor("dropdownbackground", "color"))
            .setChildOf(this.bgBox)

        this.dropDownScrollable = new ScrollComponent("", 5)
            .setX((-1).pixels())
            .setY((0).pixels())
            .setWidth((98).percent())
            .setHeight((98).percent())
            .setChildOf(this.dropDownBg)

        this.scrollBar = new UIRoundedRectangle(this._getSchemeValue("scrollbar", "roundness"))
            .setX((2.5).pixels(true))
            .setColor(this._getColor("scrollbar", "color"))
            .setWidth((2).percent())
            .setHeight((2).percent())
            .setChildOf(this.dropDownBg)

        this.dropDownScrollable.setVerticalScrollBarComponent(this.scrollBar);

        this.options.forEach((obj, idx) => {
            const optionBg = new UIRoundedRectangle(5)
                .setX((0).pixels())
                .setY(new CramSiblingConstraint(5))
                .setWidth((100).percent())
                .setHeight((20).percent())
                .setColor(ElementUtils.getJavaColor([0, 0, 0, 0]))
                .setChildOf(this.dropDownScrollable)

            const checkBox = new CheckboxFix(obj.value, 0, 0, 20, 100, false)
                .onMouseClickEvent((value) => {
                    this._triggerEvent(this.onMouseClick, obj.configName, value)
                })
                ._create(this.colorScheme[this.elementType])
                .setChildOf(optionBg)

            const mainBox = new UIRoundedRectangle(this._getSchemeValue("optionsbackground", "roundness"))
                .setX((22).percent())
                .setY((0).pixels())
                .setWidth((75).percent())
                .setHeight((100).percent())
                .setColor(this._getColor("optionsbackground", "color"))
                .enableEffect(new OutlineEffect(this._getColor("optionsbackground", "outlineColor"), this._getSchemeValue("optionsbackground", "outlineSize")))
                .setChildOf(optionBg)

            const mainBoxText = new UIWrappedText(obj.title, true, null, true, true)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((100).percent())
                .setColor(this._getColor("optionstext", "color"))
                .setTextScale((this._getSchemeValue("optionstext", "scale")).pixels())
                .setChildOf(mainBox)
        })

        this.dropDownBg.hide(true)

        // Events
        this.textBgBox.onMouseClick(this._onMouseClick.bind(this))
        this.arrowText.onMouseClick(this._onMouseClick.bind(this))

        this.dropDownScrollable
            // Avoid these events going to the parent component
            .onMouseClick((comp, event) => event.stopPropagation())
            .onMouseScroll((comp, event) => event.stopPropagation())

        this.scrollBar
            // Same story
            .onMouseClick((comp, event) => event.stopPropagation())
            .onMouseScroll((comp, event) => event.stopPropagation())

        return this.bgBox
    }
}