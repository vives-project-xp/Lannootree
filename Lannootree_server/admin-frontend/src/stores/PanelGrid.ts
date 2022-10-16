import type { Ref } from 'vue'
import Matrix from '@/assets/Matrix'
import { ref, computed } from 'vue'
import { defineStore } from "pinia"
import { Panel } from '@/assets/Panel'
import type { Coordinate } from '@/assets/Panel'

export const usePanelGrid = defineStore('panel-grid', () => {

  const LED_PER_PANEL = 72;

  const currentChannel = ref("CA0");

  const panels = ref<Matrix<Panel | null>>(new Matrix(3, 3));
  panels.value.setValue(1, 1, new Panel(true, { col: 1, row: 1 }));

  const colCount = computed(() => panels.value.dimention()[0]);
  const rowCount = computed(() => panels.value.dimention()[1]);

  const totalPanels = computed(() => {
    return rowCount.value * colCount.value;
  });

  const addPanel = function(coordinate: Coordinate) {
    let [cols, rows] = panels.value.dimention();

    if (coordinate.col == 0 || coordinate.row == 0 || coordinate.row == rows - 1 || coordinate.col == cols - 1) 
      panels.value = panels.value.resize(cols + 1, rows + 1);
    
      panels.value.setValue(coordinate.col, coordinate.row, new Panel(true, { col: coordinate.col, row: coordinate.row }));
  };

  const changeChannel = function(coordinate: Coordinate, channel: string) {
    let panel = panels.value.getValue(coordinate.col, coordinate.row);

    if (panel !== null && panel !== undefined) {
      panel.channel = channel;    
    }
  }

  return { 
    // Ref & computed
    panels,
    rowCount,
    colCount,
    totalPanels,

    // Methods 
    addPanel,
    changeChannel,

    // Const
    LED_PER_PANEL 
  };

});
