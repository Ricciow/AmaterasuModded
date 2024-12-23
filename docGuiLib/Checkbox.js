import { AspectConstraint, RelativeConstraint , AdditiveConstraint, CenterConstraint } from "../../Elementa"
import CheckboxElementOld from "../../DocGuiLib/elements/Checkbox"

export default class CheckboxElement extends CheckboxElementOld {
    constructor(check = false, x, y, width, height, outline = false) {
        super(check, x, y, width, height, outline)
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        let result = super._create(colorScheme, elementType)

        this.checkMark
        .setX(new AdditiveConstraint(new CenterConstraint, (this._getSchemeValue("check", "xOffset")).pixels()))
        .setY(new AdditiveConstraint(new CenterConstraint, (this._getSchemeValue("check", "yOffset")).pixels()))
        .setWidth(new AspectConstraint(1))
        .setHeight(new RelativeConstraint(this._getSchemeValue("check", "size")))

        return result
    }
}