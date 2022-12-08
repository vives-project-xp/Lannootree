import { ref, computed } from 'vue'
import { defineStore } from "pinia"

import Matrix from '@/assets/ConfigView/Matrix'
import { Panel } from '@/assets/ConfigView/Panel'
import type { Coordinate } from '@/assets/ConfigView/Panel'
import type JsonConfig from '@/assets/ConfigView/JsonConfig'
import type { Channel } from '@/assets/ConfigView/JsonConfig'

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
  
  const connectionPhase = ref(false);

  const connection = ref({
    from: { col: 0, row: 0},
    to: { col: 0, row: 0 }
  });

  const addConnection = function() {
    let fromPanel = panels.value.getValue(connection.value.from.col, connection.value.from.row);
    let toPanel = panels.value.getValue(connection.value.to.col, connection.value.to.row);

    if (fromPanel !== null && toPanel !== null) {
      fromPanel.connection = toPanel;
      toPanel.parentConnection = fromPanel;
    }

    connectionPhase.value = false;
  }

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

    [cols, rows] = panels.value.dimention();

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        let p = panels.value.getValue(col, row);
        if (p !== null && p !== undefined) p.coordinate = { col: col, row: row };
      }
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

    if (panel?.connection !== panel) {
      // Remove all connection going forward
      let current: Panel | null | undefined = panel;
      let next: Panel | null | undefined = current?.connection;

      do {
        if (current) current.connection = current;
        if (next) next.parentConnection = null;
        
        current = next;
        next = current?.connection;

      } while (current?.uuid !== current?.connection.uuid);

      // Remove connection to parentConnection
      if (panel && panel.parentConnection) {
        panel.parentConnection.connection = panel?.parentConnection,
        panel.parentConnection = null;
      }
    }

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

    // Find all unique channels
    panels.value.forEach((panel: Panel | null) => {
      if (panel !== null && !inUseChannels.find(c => c == panel.channel)) inUseChannels.push(panel.channel);
    });

    // Count panels
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

    obj.inUseChannels.forEach(chan => {
      let panelsInChannel = panels.value.toArray().filter(p => {
        if (p) return p.channel == chan;
        return false;
      });

      let ledCount = panelsInChannel.length * 72;
      let head = panelsInChannel.find(p => p?.parentConnection === null);
      let cells = [];

      let current = head;
      let next = current?.connection;

      do {
        cells.push({
          uuid: current?.uuid,
          coordinate: current?.coordinate,
          connection: next?.uuid
        });

        current = next;
        next = current?.connection;

      } while (current?.connection.uuid !== current?.uuid);

      cells.push({
        uuid: current?.uuid,
        coordinate: current?.coordinate,
      });

      obj.channels[chan] = {
        ledCount: ledCount,
        head: head?.uuid,
        cells: cells
      };

    });

    return JSON.stringify(obj, null, 2);
  });

  changeChannel({ col: 1, row: 1 }, "CA0");

  return { 
    panels,
    connectionPhase,
    connection,
    addConnection,
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
