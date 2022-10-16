import type { Ref } from 'vue'
import Matrix from '@/assets/Matrix'
import { ref, computed } from 'vue'
import { defineStore } from "pinia"
import { Panel } from '@/assets/Panel'

export const usePanelGrid = defineStore('panel-grid', () => {
  
  const LED_PER_PANEL = 72;

  const currentChannel = ref("CA0");

  const panels = ref<Matrix<Panel>>(new Matrix(3, 3));

  const grid: Ref<Panel[][]> = ref([
    [new Panel(false), new Panel(false), new Panel(false)],
    [new Panel(false), new Panel(true ), new Panel(false)],
    [new Panel(false), new Panel(false), new Panel(false)]
  ]);

  const colCount = computed(() => grid.value.length);
  const rowCount = computed(() => grid.value[0].length);

  const totalPanels = computed(() => {
    return rowCount.value * colCount.value;
  });

  const numberToPanel = function(n: number) {
    let row = Math.floor((n - 1) / colCount.value);
    let col = n - (row * colCount.value) - 1;

    grid.value[col][row].coordinate = { col: col, row: row };

    return grid.value[col][row];
  };

  const addPanel = function(panel: Panel) {
    panel.active = true;
    panel.channel = currentChannel.value;

    if (panel.coordinate.col == 0) grid.value.unshift(
      new Array(rowCount.value)
      .fill(null)
      .map(e => new Panel(false))
    );

    if (panel.coordinate.row == 0) grid.value.forEach(
      row => row.unshift(new Panel(false))
    );

    if (panel.coordinate.row == rowCount.value - 1) grid.value.forEach(
      row => row.push(new Panel(false))
    );

    if (panel.coordinate.col == colCount.value - 1) grid.value.push(
      new Array(rowCount.value)
      .fill(null)
      .map(e => new Panel(false))
    );
  };

  const changeChannel = function(panel: Panel, channel: string) {
    panel.channel = channel;
  }

  return { 
    // Ref & computed
    grid, 
    panels,
    rowCount,
    colCount,
    totalPanels,

    // Methods
    numberToPanel, 
    addPanel,
    changeChannel,

    // Const
    LED_PER_PANEL 
  };

});
