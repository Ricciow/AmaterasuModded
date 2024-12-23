import CategoryOld from "../../Amaterasu/core/Category"
import { ScrollComponent, UIRoundedRectangle, SiblingConstraint } from "../../Elementa"
import Button1Element from "../../DocGuiLib/elements/Button1"
import CreateElement from "./CreateElement"
import ElementUtils from "../../DocGuiLib/core/Element"

export default class Category extends CategoryOld {
    constructor(parentClass, categoryName, selected = false, shouldCreate = true) {
        this.parentClass = parentClass
        this.categoryName = categoryName

        this.handler = this.parentClass.handler
        this.leftBlock = this.parentClass.leftBlock
        this.mainBlock = this.parentClass.mainBlock
        this.mainRightBlock = this.parentClass.mainRightBlock
        this.config = this.parentClass.config

        // This is used to know if this category
        // is the one currently being selected
        this.selected = selected

        this.rightBlock = new ScrollComponent("", 5.0)
            .setX((1).pixel())
            .setY((1).pixel())
            .setWidth((98).percent())
            .setHeight((98).percent())
            .setChildOf(this.mainRightBlock)

        // This one is pretty self explanatory however.
        // [elementsSlider] here refers to the [scrollbar]
        this.elementsSlider = new UIRoundedRectangle(3)
            .setX((3).pixels(true))
            .setWidth((this.parentClass.AmaterasuGui.scrollbarSize).pixels())
            .setColor(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.scrollbar.color))

        this.rightBlock.setScrollBarComponent(this.elementsSlider, true, false)

        // Adding side button with the category name into the sidebar
        this.sidebarButton = new Button1Element(this.categoryName, 0, 0, 80, 8)
            ._setPosition(
                (1).pixel(),
                new SiblingConstraint(3)
            )
            .onMouseClickEvent(() => {
                // Avoid hiding this element incase it's the only one being shown
                if (this.parentClass.currentCategory && this.parentClass.currentCategory === this.categoryName) return

                this._setSelected(true)
                this.parentClass._checkCategories()
            })
        
        this.sidebarButton
            ._create(this.handler.getColorScheme())
            .setChildOf(this.leftBlock)

        // Hide/Unhides this category from the main block
        this._refresh()
        // Creat the elements for this gui based off of the [JSON] file
        if (shouldCreate) this.createElementClass = new CreateElement(this)
    }
}