
namespace TextRight.ContentEditor.Input {

  /**
   * Combination of modifier keys.  Flag enum
   */
  export enum ModifierKeyState {
    None = 0x00,
    Shift = 0x01,
    Alt = 0x02,
    Ctrl = 0x04,
  }

  /**
   * Interface for an object that can be registered as a keyboard
   * shortcut with the KeyboardShortcutManager 
   */
  export interface IKeyboardShortcut {

    /**
     * The keycode of the key that should be pressed to enable the shortcut
     */
    keyCode: number;

    /**
     * The modifiers that need to be held in order to enable the shortcut
     */
    modifiers: ModifierKeyState;

    /**
     * The callback to invoke when the shortcut's keys are pressed.
     */
    action: Function;
  }

  /**
   * A association between keyboard keys and the action that should be taken when
   * those keys are pressed 
   */
  export class KeyboardShortcutManager {

    private _shortcutLookup = new Map<number, IKeyboardShortcut | IKeyboardShortcut[]>();

    /**
     * Add a new keyboard shortcut to the collection
     * @param shortcut the shortcut to add
     */
    public add(shortcut: IKeyboardShortcut) {

      let code = shortcut.keyCode;

      let existing = this._shortcutLookup.get(code);

      if (existing == null) {
        this._shortcutLookup.set(code, shortcut);
      } else if (Array.isArray(existing)) {
        existing.push(shortcut);
      } else {
        this._shortcutLookup.set(code, [existing, shortcut]);
      }
    }

    /**
     * Find the keyboard shorcut currently associated with the given 
     * keyboard event state
     * @param evt the keyboard event for which the shortcut should be found
     * @returns the shortcut that should be fired as a result of the event
     *          or null if there is no such shortcut
     */
    public lookup(evt: KeyboardEvent): IKeyboardShortcut {
      let modifierState = this.getModifierState(evt);

      var shortcut = this._shortcutLookup.get(evt.keyCode);

      if (!Array.isArray(shortcut)) {
        // could be null, fyi
        return shortcut;
      }

      for (var value in shortcut) {
        var it = <IKeyboardShortcut>value;

        // TODO allow the modifiers to kind of match
        if (it.keyCode == modifierState) {
          return it;
        }
      }

      return null;
    }

    private getModifierState(evt: KeyboardEvent): ModifierKeyState {
      let modifiers = 0;

      if (evt.ctrlKey) {
        modifiers |= ModifierKeyState.Ctrl;
      }

      if (evt.altKey) {
        modifiers |= ModifierKeyState.Alt;
      }

      if (evt.shiftKey) {
        modifiers |= ModifierKeyState.Shift;
      }

      return modifiers;
    }
  }

}