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
      `Here you can see the visual representation of the Lannootree.

      As you can see, this tree is made up of various panels that can be configured to your liking. 
      In the following steps, we will walk you through the process of setting up and configuring these panels to suit your needs.`;
    
    moveToTarget(target, -100, -100);
    
    return (next: any) => {};
  }

  const explainAddPanel = function(target: Ref<HTMLElement | null>) {
    if (target.value === null) return;

    targetChangeFocus(target);

    popupWindow.value.description =
      `Adding panels to the Lannootree is easy – just click on one of the available options. 
      You can add as many panels as you like, so go ahead and give it a try! 
      Customizing the panels to fit your needs is a great way to make the Lannootree even more powerful and effective. 😃`;

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
      `Now that you have added two panels to the Lannootree, it's time to connect them. 

        To connect two panels, hold your mouse down on one of the panels for 250 milliseconds. 
        You will know when you have held the mouse down long enough when a line starts to follow your cursor. 
        To complete the connection, simply click on the panel you want to connect to.`;

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
      `Sometimes, you may accidentally make a connection between two panels that you didn't mean to. 
        If this happens, don't worry – it's easy to fix! 

        To unconnect a panel from another panel, simply connect it to itself. 
        To do this, hold your mouse down on the panel for 250 milliseconds, then click on the same panel again. 
        This will disconnect the panel from any other panel it was previously connected to. 

        Try it out for yourself and see how it works. Remember, it's always a good idea to double-check your panel connections to make sure they are set up the way you want them.`;

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
