import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from "pinia";
import type { DisplayOptions } from "@/assets/ConfigView/DisplayOptions";

export const useDisplayOptions = defineStore('display-options', () => {

  const options: Ref<DisplayOptions> = ref({
    effect_3d: true,
    show_json: false
  });

  return { 
    options
  };
  
});
