# zitro-test

## Project structure:

In general, I decided to structure the project files by functionality rather than by type.
This means that all files related to a specific feature or functionality are grouped together.
For the code or assets used in different scenes, I created a /scripts, /prefabs, and /textures folder on the project
root.
Also for more convenience, I created a /scenes folder to store all scenes of the project.

---

## Splash:

`SplashScreenHandler` listens for `ProgressBarHandler` for when it is loaded.

This class uses [EventTarget]( https://docs.cocos.com/creator/3.4/manual/en/engine/event/event-emit.html#event-listening) exposed
in `ProgressBarHandler`:

```ts
public readonly eventTarget = new EventTarget();
public readonly ON_LOAD_COMPLETE_EVENT: string = 'onLoadComplete';
```

And in `SplashScreenHandler` listens to the event, and when it is triggered, it loads the menu scene.

```ts
@property({visible: true})
_menuScene : string = 'menu';

start() {
    this._progressBar.eventTarget.on(this._progressBar.ON_LOAD_COMPLETE_EVENT, this.loadMenu, this);
}

loadMenu() {
    director.loadScene(this._menuScene);
}
```

I used `@property({visible: true})` to keep private attributes visible in the editor throughout the project.

---

## Menu:

### Buttons:

My first approach was to use `MainMenuHandler` to listen for the buttons click and load each scene.
However, I realized that it was better to use the `SceneLoaderButton` component to listen the button clicks and load the
scenes, that way I could reuse the same component for all buttons that load scenes, not just in the Menu, for example the "Return to menu" button.

At first, I also decided to create a `SceneManager` Singleton to manage the scenes loading. This class would also contain the
scene names, that way if the team decided to change their names, they would only need to change them in one place.
The `SceneLoaderButton` would use the `SceneManager` to load the scenes, but as the `SceneManager` had to be instantiated to each scene that used it and in the editor I would need to set the
scenes names manually anyways, I decided to remove it and use `SceneLoaderButton` + `director.loadScene` directly in these components, without the need of the scene manager singleton
and so without over-engineering it (KISS principle!).

### Clock:

`ClockHandler` updates and prints the clock every second. It fetches the time from an API using `TimeAPIBase` base class
at start,
scheduled every second. (_fetchInterval)

```ts
start() {
    this.timeLabel.string = "Fetching current time...";
    this.schedule(this.fetchTime, this._fetchInterval);
}
```

It prevents overlapping calls to the API by using a boolean flag `_isFetching`.

The World Time API http://worldtimeapi.org/api/timezone/Europe/Madrid wasn't working (nor https) at the time of
development,
so at first I used Time API https://timeapi.io/api/Time/current/zone?timeZone=Europe/Madrid.

In order to create a scalable API fetching structure, I created a base class `TimeAPIBase` that can be extended to
create different API handlers.
This allows for easy addition of new time APIs in the future without modifying the existing code.
`ClockHandler` just calls for:

```ts
const time: TimeData = await this._timeAPI.getCurrentTime();
```

And `TimeAPIBase` will handle the API fetching, parsing and returning a fallback in case of error, using `Date`.

---

## Quiz:

I separated the quiz logic into a `QuizHandler` responsible for loading the questions from a JSON file, managing the
current question, and checking the answers; and `QuizVisualsHandler` that manages the UI visual animations.

### Json Data:

The Json is structured following:

```ts
export type QuestionData = {
    text: string;
    answers: AnswerData[];
};

export type AnswerData = {
    text: string;
    isCorrect: boolean;
};
```

And so `QuizHandler` loads the questions from a Json file referenced in the editor like this:

```ts
const data = this._quizJson.json as { questions: QuestionData[] };
this._questions = data.questions;
```

### Quiz Logic:

I used `this._unaskedQuestions = [...this._questions];` to create a shallow copy of the questions array, so I can remove
the asked questions
from it, and easily get a random question from it and handle when is empty to trigger the "Game Over".

In `startRandomQuestion` method I get a random question from the unasked questions and I fill the `AnswerButtonHandler`
with the answers randomly.
It also subscribes to on button click event to check the answer when the button is clicked.

```ts
answerButtonHandler.button.node.on(Button.EventType.CLICK, () => {
    this.handleAnswerButton(answer, answerButtonHandler);
});
```

And calls `unsubcribeButtonsClickEvents` once any button is clicked to prevent multiple subscriptions on the next round.
Now I actually see that I could have used a single event listener for all buttons and just check which button was
clicked, but this way is more explicit, robust, and easier to understand.

`QuizHandler` is in direct communication with `QuizVisualsHandler` to update the UI visuals, and waits for the animation
to finish before proceeding to the next phase.

For example, it activates the buttons after the question animation is finished:

```ts
this._quizVisualsHandler.startQuestionAnimation(this.activateButtons.bind(this));
```

And it waits for the win/loose effect to finish before starting a new question:

```ts
handleAnswerButton(answer:AnswerData, answerButtonHandler: AnswerButtonHandler) {
    this.deActivateButtons();
    this.unsubcribeButtonsClickEvents();

    if (answer.isCorrect) {
        answerButtonHandler.playCorrectAnimation();
        this._quizVisualsHandler.winEffect(this.startRandomQuestion.bind(this));
    }
    else {
        answerButtonHandler.playIncorrectAnimation();
        this._quizVisualsHandler.looseEffect(this.startRandomQuestion.bind(this));
    }
}
````

### Quiz Visuals:

I mainly used `tween` to animate the UI elements, like the question text and the buttons. I also tried the Native
`Animation` Cocos component, but I preferred the flexibility of coding the animation for this case.
I also used `UIOpacity` component to fade in and out the question text and buttons, which is a simple and effective way
to handle UI transitions.

---

## Slots:

Slots is also separated into logic and visuals. /scripts/slotsParts and /scripts/visualFeedback.

`SlotsMachine` handles the overall logic, checking for winning combinations, and contains the array of `ReelHandler`,
which are the reels that contain the symbols `SlotSymbol`.

### SlotsMachine

`SlotsMachine` listens for both `_spinButton` and `_forceWinButton` click events to start the spin or force a win.
To comply with the task timings, I used Coco's [Scheduler](https://docs.cocos.com/creator/3.4/manual/en/scripting/scheduler.html#scheduler)  
When the spin button is clicked, it starts a timer that will trigger each reel `spin()` correctly delayed, as well as
the `stop()` methods.

To check for the timers I created `printTimeMargin` to "console.log" the time margin between the current time and the
next, and I actually saw the logs weren't as precise as expected.
That's because the scheduling can be affected by other factors, and will trigger the event as soon as possible, not
exactly at the scheduled time.

As for the method `checkPrizes`:

```ts
checkPrizes() {
    const centerSymbols: SlotSymbol[] = this.getCenterSymbols();
    if (centerSymbols[0].equals(centerSymbols[1]) && centerSymbols[1].equals(centerSymbols[2])) {
        this.eventTarget.emit(this.ON_WIN_EVENT_NAME);
        centerSymbols.forEach(symbol => {
            symbol.setWinVisuals();
        })
        return;
    }

    this.eventTarget.emit(this.ON_LOOSE_EVENT_NAME);
    centerSymbols.forEach(symbol => {
        symbol.setLooseVisuals();
    })

    this.activateButtons();
}
```

First of all it gets the center symbols for each reel, which at this point they're sorted out and the center symbol
would just be the index 1 of the array.
Then it checks if all center symbols are equal, if so, it emits the `ON_WIN_EVENT_NAME` and sets the win visuals for
each symbol.
If not, it emits the `ON_LOOSE_EVENT_NAME` and sets the loose visuals.

These events will be listened by `SlotsVisualsHandler` to update the UI accordingly.

### ReelHandler:

Each reel structure is like follows:  

Reel
- Mask
-
    - VerticalLayout
-
    -
        - SlotSymbol
-
    -
        - SlotSymbol
-
    -
        - ...

The Mask prevents the symbols from being visible outside the reel area, and the VerticalLayout arranges the symbols
vertically, but just for the editor, because it's disabled `onLoad`, to enable `SlotSymbols` to be positioned freely within the reel.

`ReelHandler` places the symbols using `_symbolHeight` to calculate the y position of each symbol based on its index.
y = 0 would be the top of the reel, and the calculation of the "out of bounds" will depend on the reel direction.

There's `_spinDownside: boolean` attribute to determine if the reel spins downwards or upwards, by default it spins
downwards.

To create an accelerated spin effect, I used a `tween` to handle `_spinSpeed` to use it with `update(dt: number)` delta
time to update the position of the symbols based on the speed:

```ts
let deltaY = this._spinningSpeed * dt;
```

And then iterating through the symbols and updating their position accordingly, per frame, as well as checking if they are out of bounds.

```ts
for (const symbol of this._symbols) {
    let pos = symbol.node.position;
    let newY = pos.y + deltaY;

    if (this._spinDownside) {
        if (newY < -this._symbolHeight * 3 - this._symbolHeight / 2) {
            newY += this._numberSymbols * this._symbolHeight;
            this.updateSymbol(symbol);
        }
    }
    else {
        if (newY > this._symbolHeight / 2) {
            newY -= this._numberSymbols * this._symbolHeight;
            this.updateSymbol(symbol);
        }
    }

    symbol.node.setPosition(0, newY, 0);
}
```

And the actual tween to handle the acceleration and deceleration of the spin is done like this:

```ts
this._currentTween = tween(obj)
    .to(this._spinAccelerationDuration, {speed: this._spinSpeed}, {
        easing: 'quadIn',
        onUpdate: () => {
            this._spinningSpeed = obj.speed;
        },
    })
    .start();
```

This way I could control the speed of the spin and the acceleration/deceleration effect.

When the reel `stop()` is called and finishes the tween, it calls for `reorderReel()`.
There it sorts the symbols by their y position, so the top symbol is the one with the highest y position after handling out of bound symbols.

```ts
this._symbols.sort((a, b) => b.node.position.y - a.node.position.y);
```

And instead of adjusting the symbols' positions directly, I used a tween to animate their final positions smoothly.
```ts
for (let i = 0; i < this._symbols.length; i++) {
    const y = -i * this._symbolHeight - this._symbolHeight / 2;
    tween(this._symbols[i].node)
        .to(this._finalSymbolAdjustmentTime, {position: new Vec3(0, y, 0)}, {
            easing: 'quadOut',
        })
        .start();
}
```

### SlotSymbol:
`SlotSymbol` is a simple component that just holds the symbol texture and handles its own win/loose visuals.

The most relevant attributes are:

```ts
@property(Sprite)
iconSprite: Sprite;

identifier: number = -1;
isFixed: boolean = false;
```

They are public and ready to be set by `ReelHandler`. To check if two symbols are equal, I decided to use the `identifier` attribute, which is set by `ReelHandler` when the symbols are created.
This way, I can easily check if two symbols are equal by comparing their identifiers.

### Forcing a Win:
To force a win, `SlotsMachine` calls `startWinSpin()`, which:
```ts
const winningSymbolIndex = this._reels[0].getRandomSymbolIndex();
//this creates the ilusion of a win by adjusting the winning symbol with an offset that will get to the center
const positionIndex = 2;
for (let i = 0; i < this._reels.length; i++) {
    this.scheduleOnce(() => {
        this._reels[i].forceSymbolAtPositionIndex(winningSymbolIndex, positionIndex);
    }, stopDelay + i * this._spinDelay);
}
```

It gets a random symbol index from the first reel, and then it schedules the `forceSymbolAtPositionIndex` method to be called for each reel with a delay.
The correct "forcing symbol" without being noticeable to the player should be in an offset so that it just appears from out of bounds and lands in the center position.
To do that, I used the `positionIndex` to get the closest symbols at a specific height. But I also had to keep in mind the reel direction, so I used the `spinDownside` attribute to adjust the position accordingly inside
`forceSymbolAtPositionIndex`:

```ts
forceSymbolAtPositionIndex(winningSymbolIndex: number, positionIndex: number) {
        if (!this._spinDownside) {
            positionIndex += 3;
            positionIndex *= -1;
        }
        
        let height = this._symbolHeight * positionIndex;
        const closestSymbol = this._symbols.reduce((prev, curr) => {
            return Math.abs(curr.node.position.y - height) < Math.abs(prev.node.position.y - height) ? curr : prev;
        });
        
        this.setWinningSymbol(closestSymbol, winningSymbolIndex);
    }
```

### SlotsVisualsHandler:
This component is mainly responsible for the audio and visual feedback of the slots game.
I used `AudioSource` + `AudioClip` to play the audio effects, and it activates an animated `_winTextNode`
as well as instancing multiple `_winEffectPrefab` prefabs to create a visual effect when the player wins,
which are randomly positioned particles controlled by `WinParticlesHandler`.

--- 

## Responsiveness:

To ensure the game is responsive and adapts to different screen sizes, I created the singleton: `OrientationService`
which binds to window resize events:
```ts
constructor() {
    this.updateOrientation();
    window.addEventListener('orientationchange', this._onWindowChange.bind(this));
    window.addEventListener('resize', this._onWindowChange.bind(this));
}
```

And emits an event to notify the listeners when the orientation changes or the window is resized.

The components are:
- ResponsiveLayout
- ResponsiveScaler
- ResponsiveWidget

### ResponsiveLayout:
Should be attached as a component to a Node that contains a `Layout` component.
It will automatically adjust the layout based on the current orientation:  

Landscape -> Horizontal Layout  
Portrait -> Vertical Layout

### ResponsiveScaler:
Scales the node based on the current orientation.
```ts
updateScale(isLandscape: boolean) {
    const scale = isLandscape ? this._horizontalScale : this._verticalScale;
    this.node.setScale(scale, scale, 1);
}
```

### ResponsiveWidget:
Right now this component only handles the bottom anchor, but it can be extended to handle others.

```ts
updateAlignment(isLandscape: boolean) {
        if (!this.widget) return;
        this.widget.bottom = isLandscape ? this._landscapeBottom : this._portraitBottom;
        this.widget.updateAlignment();
}
```