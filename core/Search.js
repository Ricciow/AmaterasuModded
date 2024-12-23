import SearchElementOld from "../../Amaterasu/core/Search"
import { ScrollComponent, UIRoundedRectangle } from "../../Elementa"
import TextInputElement from "../../DocGuiLib/elements/TextInput"
import CreateElement from "./CreateElement"
import ElementUtils from "../../DocGuiLib/core/Element"

export default class SearchElement extends SearchElementOld {
    constructor(settingsClass) {
        this.parentClass = settingsClass
        this.handler = this.parentClass.handler
        this.mainRightBlock = this.parentClass.mainRightBlock
        this.mainBlock = this.parentClass.mainBlock
        this.oldConfig = this.parentClass.config
        this.config = {}
        this.categoryName = "Search Results"

        this.selected = false
        this.sliderAdded = false
        this.matches = null
        this.hasSearched = false

        this.rightBlock = new ScrollComponent("no elements found", 5.0)
            .setX((1).pixel())
            .setY((1).pixel())
            .setWidth((98).percent())
            .setHeight((98).percent())
            .setChildOf(this.mainRightBlock)

        this.elementsSlider = new UIRoundedRectangle(3)
            .setX((3).pixels(true))
            .setWidth((this.parentClass.AmaterasuGui.scrollbarSize).pixels())
            .setColor(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.scrollbar.color))

        this.rightBlock.setScrollBarComponent(this.elementsSlider, true, false)
        this.rightBlock.hide()

        this.searchBar = new TextInputElement("", 0, 0, 100, 100)
            .setPlaceHolder("Search...")
            .onMouseClickEvent(() => this.selected = true)
            .onKeyTypeEvent(this._onKeyType.bind(this))

        this.createElementClass = new CreateElement(this)

        // Whenever [CTRL+F] is typed on the main window enable search
        this.handler.getWindow().onKeyType((_, __, keycode) => {
            if (keycode !== 33 || !Keyboard.isKeyDown(Keyboard.KEY_LCONTROL)) return

            this._focusSearch()
        })

        this.searchBar
            ._create(this.handler.colorScheme)
            .setChildOf(this.parentClass.searchBarBg)
    }
}