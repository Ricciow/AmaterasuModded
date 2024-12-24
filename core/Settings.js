import SettingsOld from "../../Amaterasu/core/Settings"
import SearchElement from "./Search"
import { UIRoundedRectangle, UIText, OutlineEffect, ScrollComponent, CramSiblingConstraint, CenterConstraint, animate, Animations , ConstantColorConstraint} from "../../Elementa"
import Category from "./Category"
import MarkdownElement from "../../DocGuiLib/elements/Markdown"
import ElementUtils from "../../DocGuiLib/core/Element"
const Color = Java.type("java.awt.Color")

export default class Settings extends SettingsOld {
    constructor(moduleName, defaultConfig, colorSchemePath, titleText) {
        super(moduleName, defaultConfig, colorSchemePath, titleText)
    }

    _init() {
        this.mainBlock = new UIRoundedRectangle(this.handler.getColorScheme().Amaterasu.background.roundness)
            .setX((this.AmaterasuGui.background.x).percent())
            .setY((this.AmaterasuGui.background.y).percent())
            .setWidth((this.AmaterasuGui.background.width).percent())
            .setHeight((this.AmaterasuGui.background.height).percent())
            .setColor(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.background.color))
            .enableEffect(new OutlineEffect(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.background.outlineColor), this.handler.getColorScheme().Amaterasu.background.outlineSize))

        this.title = new UIText(this.titleText)
            .setX(new CenterConstraint())
            .setY((3).percent())
            .setTextScale((this.handler.getColorScheme().Amaterasu.title.scale).pixels())
            .setColor(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.title.color))
            .setChildOf(this.mainBlock)

        this.searchBarBg = new UIRoundedRectangle(3)
            .setX((this.AmaterasuGui.searchBar.x).percent())
            .setY((this.AmaterasuGui.searchBar.y).percent())
            .setWidth((this.AmaterasuGui.searchBar.width).percent())
            .setHeight((this.AmaterasuGui.searchBar.height).percent())
            .setColor(ElementUtils.getJavaColor([0, 0, 0, 0]))
            .setChildOf(this.mainBlock)

        this.topLine = new UIRoundedRectangle(3)
            .setX((0.5).percent())
            .setY(new CramSiblingConstraint(5))
            .setWidth((99).percent())
            .setHeight((this.handler.getColorScheme().Amaterasu.line.size).percent())
            .setColor(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.line.color))
            .enableEffect(new OutlineEffect(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.line.outlineColor), this.handler.getColorScheme().Amaterasu.line.outlineSize))
            .setChildOf(this.mainBlock)

        this.leftBlockBg = new UIRoundedRectangle(3)
            .setX((0.75).percent())
            .setY(new CramSiblingConstraint(5))
            .setWidth((18).percent())
            .setHeight((87).percent())
            .setColor(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.panel.leftColor))
            .setChildOf(this.mainBlock)

        this.leftBlock = new ScrollComponent("no elements", 5.0)
            .setX((1).percent())
            .setY((1).percent())
            .setWidth((98).percent())
            .setHeight((98).percent())
            .setChildOf(this.leftBlockBg)

        this.leftBlockScrollbar = new UIRoundedRectangle(3)
            .setX((3).pixels(true))
            .setWidth((this.AmaterasuGui.scrollbarSize).pixels())
            .setColor(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.scrollbar.color))
            .setChildOf(this.leftBlockBg)

        this.leftBlock.setScrollBarComponent(this.leftBlockScrollbar, true, false)

        this.mainRightBlock = new UIRoundedRectangle(3)
            .setX(new CramSiblingConstraint(5))
            .setY(new CramSiblingConstraint(5))
            .setWidth((70).percent())
            .setHeight((87).percent())
            .setColor(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.panel.rightColor))
            .setChildOf(this.mainBlock)

        this.searchBar = new SearchElement(this)

        this.handler.draw(this.mainBlock, false)

        if (this.sortCategories) this.config.sort(this.sortCategories)

        this.config.forEach((obj, index) => {
            const categoryName = obj.category

            this.categories.set(
                categoryName,
                new Category(this, categoryName, index === 0).createElementClass._create()
            )
        })
    }

    addMarkdown(category, text, _internal = false) {
        if (Array.isArray(text)) text = text.join("\n")

        if (!_internal) this.markdowns.push([category, text])

        const markdownCategory = new Category(this, category, false, false)
        new MarkdownElement(text, 0, 0, 85, 85)
            ._setPosition(
                new CenterConstraint(),
                new CramSiblingConstraint(5)
            )
            ._create(this.handler.getColorScheme())
            .setChildOf(markdownCategory.rightBlock)

        this.categories.set(category, markdownCategory)

        return this
    }

    _checkScheme(path) {
        const mainDefaultScheme = JSON.parse(FileLib.read("DocGuiLib", "data/DefaultColors.json"))
        let defaultScheme = JSON.parse(FileLib.read("AmaterasuModded", "data/_DefaultScheme.json"))
        let colorScheme = JSON.parse(FileLib.read(this.moduleName, path)) ?? defaultScheme

        if (colorScheme?.Amaterasu?.backgroundBox) {
            const oldSchemePath = `${path.replace(/\.json/, "")}_old.json`
            console.warn(`[Amaterasu - ${this.moduleName}] old scheme system detected, your old scheme has been saved as ${oldSchemePath}`)

            this._saveScheme(oldSchemePath, colorScheme)
            // Reset values since we need it to be a clean new object
            colorScheme = {}
        }

        defaultScheme = mergeObjects(defaultScheme, mainDefaultScheme)
        colorScheme = mergeObjects(colorScheme, defaultScheme)

        this._saveScheme(path, colorScheme)

        return colorScheme
    }

    redirect(categoryName, configName = null) {
        const categoryInstance = this.categories.get(categoryName)
        if (!categoryInstance) throw new Error(`${categoryName} is not a valid category name.`)

        // Reset the state of all the categories
        this.categories.forEach(value => value._setSelected(false))

        // Set the new category's state
        this.oldCategory = null
        this.currentCategory = categoryName

        // Update the state of the given categoryName
        this.categories.get(this.currentCategory)._setSelected(true)

        if (configName) {
            Client.scheduleTask(2, () => {
                const rightBlock = categoryInstance.rightBlock
                const comp = categoryInstance.createElementClass._find(configName)?.component
                if (!comp) return
                
                const newY = rightBlock.getTop() - comp.getTop()
                //Modified smooth to false since weird jiggly behaviour
                categoryInstance.rightBlock.scrollTo(0, newY, false)

                //Added Color Animation
                const oldColor = comp.getColor()
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                            Animations[this.handler.getColorScheme().Amaterasu.redirect.animationFadeIn],
                            this.handler.getColorScheme().Amaterasu.redirect.duration,
                            new ConstantColorConstraint(ElementUtils.getJavaColor(this.handler.getColorScheme().Amaterasu.redirect.color)),
                            this.handler.getColorScheme().Amaterasu.redirect.delay
                        )
                    animation.onComplete(() => {
                        animate(comp, (animation) => {
                            animation.setColorAnimation(
                                Animations[this.handler.getColorScheme().Amaterasu.redirect.animationFadeOut],
                                this.handler.getColorScheme().Amaterasu.redirect.duration,
                                new ConstantColorConstraint(oldColor),
                                this.handler.getColorScheme().Amaterasu.redirect.delay
                            )
                        })
                    })
                })
            })
        }

        return this
    }
}