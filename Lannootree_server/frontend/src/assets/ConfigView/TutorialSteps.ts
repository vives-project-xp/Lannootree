import { ref } from 'vue';
import type { Ref } from 'vue';
import type { Popup } from './Popup';

export default (popupWindow: Ref<Popup>, x: Ref<number>, y: Ref<number>) => {

  const previousTraget = ref<HTMLElement | null>(null);
  
  const moveToTarget = function(target: Ref<HTMLElement | null>, xOffset: number, yOffset: number) {
    if (target.value === null) return;

    const bounds = target.value.getBoundingClientRect();
    
    x.value = bounds.x + xOffset;
    y.value = bounds.y + yOffset;
  }

  const targetChangeFocus = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;
    
    if (previousTraget.value === null) {
      previousTraget.value = target.value;
      target.value.classList.add("focus");
    } 

    previousTraget.value.classList.remove("focus");
    previousTraget.value = target.value;
    target.value.classList.add("focus");
  }

  const explainPanels = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);
    
    popupWindow.value.description =
      "This is the visual representation of the lannootree";
    
    moveToTarget(target, -100, -100);
    
    return () => {};
  }

  const explainAddPanel = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);

    popupWindow.value.description =
      "To add a panel simply click on of the available panels."

    popupWindow.value.buttonText = "";

    
  }
  
  return [
    explainPanels,
    explainAddPanel,

  ];
}
