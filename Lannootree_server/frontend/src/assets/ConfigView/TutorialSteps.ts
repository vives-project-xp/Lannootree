import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { Popup } from './Popup';
import { usePanelGrid } from '@/stores/PanelGrid';

export default (popupWindow: Ref<Popup>, x: Ref<number>, y: Ref<number>) => {

  const previousTraget = ref<HTMLElement | null>(null);
  const panelStore = usePanelGrid();
  
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
      "Here you can see the visual representation of the Lannootree.\n\n\
      This is where we will configure the panels.";
    
    moveToTarget(target, -100, -100);
    
    return (next: any) => {};
  }

  const explainAddPanel = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);

    popupWindow.value.description =
      "To add a panel simply click on one of the available panels.\n\n\
      Go ahead and add one panel 😃."

    popupWindow.value.buttonText = "";

    return (next: any) => {
      let undoWatch: any;

      undoWatch = watch(panelStore.panels, () => {
        undoWatch();
        next();
      });
    }
  }
  
  const explainConnecting = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);

    popupWindow.value.description =
      "Now that we have 2 pannels we can connect them.\n\n\
      To connect 2 pannels hold your mouse down for 250ms on one the pannels.\n\n\
      You will know when you pressed long enough when a line start to follow you cursor\n\n\
      To then make the conection click on the panel you want to connect to.";

    return (next: any) => {
      let undoWatch: any;

      undoWatch = watch(
        () => panelStore.connectionEvent, 
        () => {
          undoWatch();
          next();
        }
      );
    }
  }

  const explainDeconnecting = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);

    popupWindow.value.description =
      "But what if we accedentaly made the wrong connection 🤔 ?\n\n\
      To unconnect a connection, you have to just connect the panel with itself.\n\n\
      Go ahead and ty it.";

      return (next: any) => {
        let undoWatch: any;
  
        undoWatch = watch(
          () => panelStore.connectionEvent, 
          () => {
            undoWatch();
            next();
          }
        );
      }
  }

  const explainChangeingChannel = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);

    popupWindow.value.description =
      "When we have a big amount of panels, it is a good idea to split these in channels\n\n\
      You can do this by clicking the cog on the pannel and selecting an other channel.\n\n\
      Go ahead and change one of the channels."

      return (next: any) => {
        let undoWatch: any;
  
        undoWatch = watch(
          () => panelStore.changeChannelEvent, 
          () => {
            undoWatch();
            next();
          }
        );
      }
  }

  const explainOptionChannel = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);
    moveToTarget(target, 200, 200);

    popupWindow.value.description =
      "Ofcourse we don't want to do this for all pannel individualy.\n\n\
      We can change the default channel when we add a pannel in the options menu\n\n\
      Go ahead and select a different default channel."

    return (next: any) => {
      let undoWatch: any;

      undoWatch = watch(
        () => panelStore.currentChannel, 
        () => {
          undoWatch();
          next();
        }
      );
    }
  }

  const explainDefaultPanelAdd = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);
    moveToTarget(target, -150, -150);

    popupWindow.value.description =
      "Now go ahead an add a new panel\n\n\
      You will se that now it will use the default channel you selected."

    return (next: any) => {
      let undoWatch: any;

      undoWatch = watch(panelStore.panels, () => {
        undoWatch();
        next();
      });
    }
  }

  const explainJson = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);
    moveToTarget(target, -150, -150);

    popupWindow.value.description = 
      "Now that we configured the lannootree we can see the json representation of this config.\n\n\
      To copy this simply click on the box, or post is to the backend server using the post button."

    popupWindow.value.buttonText = "End tutotial";

    return () => {};
  }

  return [
    explainPanels,
    explainAddPanel,
    explainConnecting,
    explainDeconnecting,
    explainChangeingChannel,

    explainOptionChannel,

    explainDefaultPanelAdd,

    explainJson,
  ];
}
