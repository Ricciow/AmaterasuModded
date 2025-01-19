import TextInputElementOld from "../../DocGuiLib/elements/TextInput"

export default class TextInputElement extends TextInputElementOld {
    constructor(string = "Placeholder", x = 0, y = 0, width = 150, height = 8) {
        super(string, x, y, width, height)
    }

    setText(str) {
        this.textInput.setText(str)
    }
}