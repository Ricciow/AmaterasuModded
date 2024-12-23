import CreateElementOld from "../../Amaterasu/core/CreateElement"
import SliderElementFix from "../docGuiLib/SliderElementFix"
import MultiCheckboxFix from "../docGuiLib/MultiCheckboxFix"
import CheckboxFix from "../docGuiLib/CheckboxFix"
import { CenterConstraint } from "../../Elementa"

export default class CreateElement extends CreateElementOld {

    constructor(categoryClass) {
        super(categoryClass)
    }

    _addSlider(obj, fn) {
        const textDescription = this._makeTextDescription(obj)

        new SliderElementFix(obj.options, obj.value, 0, 0, 15, 30)
            ._setPosition(
                (5).pixel(true),
                new CenterConstraint()
            )
            .onMouseReleaseEvent(fn)
            ._create(this.handler.getColorScheme())
            .setChildOf(textDescription)

        return this
    }

    _addMultiCheckbox(obj, fn) {
        const textDescription = this._makeTextDescription(obj)

        const component = new MultiCheckboxFix(obj.options, obj.placeHolder, 0, 0, 20, 35)
            ._setPosition(
                (5).pixel(true),
                new CenterConstraint()
            )
            .onMouseClickEvent(fn)

        component
            ._create(this.handler.getColorScheme())
            .setChildOf(textDescription)

        this.rightBlock
            .onMouseScroll(() => {
                if (component.hidden) return

                component._hideDropDown()
            })
            .onMouseClick(() => {
                if (component.hidden) return

                component._hideDropDown()
            })

        this.categoryClass.parentClass.leftBlock
            .onMouseScroll(() => {
                if (component.hidden) return

                component._hideDropDown()
            })
            .onMouseClick(() => {
                if (component.hidden) return

                component._hideDropDown()
            })

        this._find(obj.name).compInstance = component

        return this
    }

    _addToggle(obj, fn) {
        const textDescription = this._makeTextDescription(obj)
        
        new CheckboxFix(obj.value, 0, 0, 12, 30, true)
            ._setPosition(
                (5).pixel(true),
                new CenterConstraint()
            )
            .onMouseClickEvent(fn)
            ._create(this.handler.getColorScheme())
            .setChildOf(textDescription)

        return this
    }
}