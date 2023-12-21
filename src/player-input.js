import { entity } from "./entity.js";
import { passes } from './passes.js';

export const player_input = (() => {
  const KEYS = {
    'a': 65,
    's': 83,
    'w': 87,
    'd': 68,
    'SPACE': 32,
    'SHIFT_L': 16,
    'CTRL_L': 17,
  };

  class PlayerInput extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
      this.container_ = document.getElementById('container'); 
      this.weaponsUi_ = document.getElementById('weapons-menu'); 
      this.weaponsUi_.style.display = 'none'; 
    }

    InitEntity() {
      this.current_ = {
        leftButton: false,
        rightButton: false,
        mouseXDelta: 0,
        mouseYDelta: 0,
      };
      this.previous_ = null;
      this.keys_ = {};
      this.previousKeys_ = {};
      // Set the target to the container element for pointer lock
      this.target_ = this.container_;
      this.target_.addEventListener('mousedown', (e) => this.onMouseDown_(e), false);
      this.target_.addEventListener('mousemove', (e) => this.onMouseMove_(e), false);
      this.target_.addEventListener('mouseup', (e) => this.onMouseUp_(e), false);
      this.target_.addEventListener('keydown', (e) => this.onKeyDown_(e), false);
      this.target_.addEventListener('keyup', (e) => this.onKeyUp_(e), false);
      this.target_.addEventListener('click', () => this.requestPointerLock_(), false);

      document.addEventListener('pointerlockchange', () => this.onPointerLockChange_(), false);
      document.addEventListener('pointerlockerror', () => this.onPointerLockError_(), false);

      this.Parent.Attributes.Input = {
        Keyboard: {
          Current: this.keys_,
          Previous: this.previousKeys_
        },
        Mouse: {
          Current: this.current_,
          Previous: this.previous_
        },
      };

      this.SetPass(passes.INPUT);
    }

    requestPointerLock_() {
      this.target_.requestPointerLock();
    }

    onPointerLockChange_() {
      if (document.pointerLockElement === this.target_) {
        console.log('Pointer lock engaged');
      } else {
        console.log('Pointer lock disengaged');
      }
    }

    onPointerLockError_() {
      console.error('Pointer lock failed');
    }

    onMouseMove_(e) {
      if (document.pointerLockElement === this.target_) {
        this.current_.mouseXDelta = e.movementX;
        this.current_.mouseYDelta = e.movementY;
      }
    }

    onMouseDown_(e) {
      this.onMouseMove_(e);
      switch (e.button) {
        case 0:
          this.current_.leftButton = true;
          break;
        case 2:
          this.current_.rightButton = true;
          this.showWeaponsUI_(); // Add this line
          console.log("right click");
          break;
      }
    }

    showWeaponsUI_() {
      if (this.weaponsUi_.style.display === 'none') {
        this.weaponsUi_.style.display = 'block';
      } else {
        this.weaponsUi_.style.display = 'none';
      }
    }

    onMouseUp_(e) {
      this.onMouseMove_(e);
      switch (e.button) {
        case 0:
          this.current_.leftButton = false;
          break;
        case 2:
          this.current_.rightButton = false;
          break;
      }
    }

    onKeyDown_(e) {
      this.keys_[e.keyCode] = true;
    }

    onKeyUp_(e) {
      this.keys_[e.keyCode] = false;
    }

    key(keyCode) {
      return !!this.keys_[keyCode];
    }

    mouseLeftReleased() {
      return !this.current_.leftButton && this.previous_.leftButton;
    }

    isReady() {
      return this.previous_ !== null;
    }
  

    Update(_) {
      if (this.previous_ !== null) {
        this.previous_ = { ...this.current_ };
        this.previousKeys_ = { ...this.keys_ };
      } else {
        // If this is the first update, initialize 'previous_'
        this.previous_ = { ...this.current_ };
      }
    }
  };

  return {
    PlayerInput: PlayerInput,
    KEYS: KEYS,
  };

})();
