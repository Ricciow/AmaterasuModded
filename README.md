# Amaterasu Modded
This uses a Modified Scheme from Original Amaterasu, see /data/_DefaultScheme.json

Modifies the Slider Bar so the box can go 50% outside the area
Also adds more precise controls to the Slide Bar using A/D or left/right Keys

Adds Scroll bar to multicheckbox, can change color based off the key "scrollbar"
inside the schemes so 


```
"MultiCheckBox": {
    ...Other stuff
    "scrollbar" : {
        "color": [0, 0, 0, 80],
        "roundness": 5
    }
}
```

Adds Size Change and offset to Checkboxes "Check"

```
"Checkbox": {
    "background": {
        ...Stuff
    },
    "check": {
        "enabled": "§l✓",
        "disabled": "",
        "size": 0.8,
        "xOffset": 3,
        "yOffset": 0
    },
    "mouseClickAnimation": {
        ...Stuff
    }
}
```

# License
This project includes components licensed under the [Amaterasu Software License](https://github.com/DocilElm/Amaterasu?tab=MIT-1-ov-file).

