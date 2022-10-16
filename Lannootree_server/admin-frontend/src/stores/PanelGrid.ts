import type { Ref } from 'vue'
import Matrix from '@/assets/Matrix'
import { ref, computed } from 'vue'
import { defineStore } from "pinia"
import { Panel } from '@/assets/Panel'
import type { Coordinate } from '@/assets/Panel'
import type JsonConfig from '@/assets/JsonConfig'

export const usePanelGrid = defineStore('panel-grid', () => {

  const LED_PER_PANEL = 72;

  const channels =[
    {
      name: 'Channel A0',
      shortName: 'CA0',
    }, {
      name: 'Channel A1',
      shortName: 'CA1',
    }, {
      name: 'Channel B0',
      shortName: 'CB0',
    }, {
      name: 'Channel B1',
      shortName: 'CB1',
    },
  ];

  const currentChannel = ref("CA0");

  const panels = ref<Matrix<Panel | null>>(new Matrix(3, 3));
  panels.value.setValue(1, 1, new Panel({ col: 1, row: 1 }));

  const colCount = computed(() => panels.value.dimention()[0]);
  const rowCount = computed(() => panels.value.dimention()[1]);

  const totalPanels = computed(() => {
    return rowCount.value * colCount.value;
  });

  const addPanel = function(coordinate: Coordinate) {
    let [cols, rows] = panels.value.dimention();

    if (coordinate.row == 0 || coordinate.row == rows - 1 || coordinate.col == 0 || coordinate.col == cols - 1)
      panels.value = panels.value.resize(cols + 1, rows + 1);

    // ? Wtf
    // if (coordinate.row == 0 || coordinate.row == rows - 1) 
    //   panels.value = panels.value.resize(cols, rows + 1);

    // if (coordinate.col == 0 || coordinate.col == cols - 1)
    //   panels.value = panels.value.resize(cols + 1, rows);
    // ?
    
    panels.value.setValue(coordinate.col, coordinate.row, new Panel({ col: coordinate.col, row: coordinate.row }));
  };

  const changeChannel = function(coordinate: Coordinate, channel: string) {
    let panel = panels.value.getValue(coordinate.col, coordinate.row);

    if (panel !== null && panel !== undefined) {
      panel.channel = channel;    
    }
  }

  const circularReplacer = function() {
    const seen = new WeakSet();

    return (key: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) value.uuid;
        seen.add(value);
      }
  
      return value;
    }
  };

  const toJson = computed(() => {
    let inUseChannels: string[] = [];
    let panelCount: number = 0;

    panels.value.forEach((panel: Panel | null) => {
      if (panel !== null && !inUseChannels.find(c => c == panel.channel)) inUseChannels.push(panel.channel);
    });

    panels.value.forEach((panel: Panel | null) => {
      if (panel !== null) panelCount++;
    });

    let [col, row] = panels.value.dimention();

    let obj: JsonConfig = {
      panelCount: panelCount,
      totalLeds: panelCount * LED_PER_PANEL,
      dimentions: {
        col: col - 1,
        row: row - 1
      },
      inUseChannels: inUseChannels,
      channels: {

      }
    };

    return JSON.stringify(obj, null, 2);
  });
  
  return { 
    // Ref & computed
    panels,
    rowCount,
    colCount,
    totalPanels,
    channels,

    // Methods 
    addPanel,
    changeChannel, 
    toJson,
  };

});
