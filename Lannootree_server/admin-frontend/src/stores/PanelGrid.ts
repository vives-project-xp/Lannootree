import type { Ref } from 'vue'
import Matrix from '@/assets/Matrix'
import { ref, computed } from 'vue'
import { defineStore } from "pinia"
import { Panel } from '@/assets/Panel'
import type { Coordinate } from '@/assets/Panel'
import type JsonConfig from '@/assets/JsonConfig'

export const usePanelGrid = defineStore('panel-grid', () => {
  
  // *---------------------------> Panel related properties <---------------------------* //
  
  const LED_PER_PANEL = 72;

  const panels = ref<Matrix<Panel | null>>(new Matrix(3, 3));
  panels.value.setValue(1, 1, new Panel({ col: 1, row: 1 }));

  const colCount = computed(() => panels.value.dimention()[0]);
  const rowCount = computed(() => panels.value.dimention()[1]);
    
  const totalPanels = computed(() => {
    return rowCount.value * colCount.value;
  });
  
  const addPanel = function(coordinate: Coordinate) {
    let [cols, rows] = panels.value.dimention();
    
    if (coordinate.col == 0 || coordinate.row == 0 || coordinate.col == cols - 1 || coordinate.row == rows - 1) {
      let resize = {
        col: (coordinate.col == 0 || coordinate.col == cols - 1) ? cols + 1 : cols,
        row: (coordinate.row == 0 || coordinate.row == rows - 1) ? rows + 1 : rows
      };
      
      let shift = {
        col: coordinate.col == 0 ? 1 : 0,
        row: coordinate.row == 0 ? 1 : 0
      };
      
      panels.value.setValue(coordinate.col, coordinate.row, new Panel(coordinate));
      panels.value = panels.value.resize(resize.col, resize.row, shift);
    }
    
    else {
      panels.value.setValue(coordinate.col, coordinate.row, new Panel(coordinate));
    }
  };

  // *------------------------------------------------------------------------------------* //

  
  // *---------------------------> Channel related properties <---------------------------* //
  
  const currentChannel = ref("CA0");
  
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

  const changeableChannels = computed(() => {
    let filter: { name: string, shortName: string}[] = [];
    channels.forEach((chan: { name: string, shortName: string}) => {
      if (chan.shortName !== currentChannel.value) filter.push(chan);
    });
    
    return filter;
  });

  const changeChannel = function(coordinate: Coordinate, channel: string) {
    let panel = panels.value.getValue(coordinate.col, coordinate.row);

    if (panel !== null && panel !== undefined) {
      panel.channel = channel;    
    }
  }

  const channelToColor = function (channel: string) {
    if (channel === 'CA0') return 'red';
    if (channel === 'CA1') return 'green';
    if (channel === 'CB0') return 'blue';
    if (channel === 'CB1') return 'yellow';
  }

  // *------------------------------------------------------------------------------------* //

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
    panels,
    totalPanels,
    addPanel,

    currentChannel,
    channels,
    changeableChannels,
    changeChannel, 
    channelToColor,

    toJson,
  };

});
