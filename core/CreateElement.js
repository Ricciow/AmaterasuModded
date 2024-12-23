import CreateElementOld from "../../Amaterasu/core/CreateElement"
import SliderElementFix from "../docGuiLib/SliderElementFix"
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
}