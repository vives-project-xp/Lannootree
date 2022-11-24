<script setup lang="ts">
  import { useTheme } from 'vuetify'
  import { computed, ref } from 'vue';
  import { usePanelGrid } from '@/stores/PanelGrid';
  import { useElementSize, useMouseInElement } from '@vueuse/core';
  import PanelVue from '@/components/configView/Panel.vue';
  import type { Coordinate, Panel } from '@/assets/ConfigView/Panel';

  const theme = useTheme();
  const panelStore = usePanelGrid();

  const boxSize = computed(() => {
    if (panelStore.totalPanels < 64) return '100px';
    return '50px';
  });

  // Resize svg to the right size
  const content_size = ref(null);
  const { width, height } = useElementSize(content_size);

  const line_svg = ref(null);
  const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(line_svg);

  // Returns center of div from where to draw line from
  const coordinateToCenterPositionPx = function(coordinate: Coordinate) {
    let [cols, rows] = panelStore.panels.dimention();    

    let widthPerPanel = width.value  / cols;
    let heightPerPanel = height.value / rows;

    let center = {
      x: (coordinate.col * widthPerPanel) + (widthPerPanel / 2),
      y: (coordinate.row * heightPerPanel) + (heightPerPanel / 2)
    };
    
    return center;
  }

  // Remove null and undefined from PanelStore.panels
  const fileteredPanels = computed(() => {
    let filtered: Panel[] = [];

    panelStore.panels.forEach((p) => {
      if (p !== null && p !== undefined) {
        filtered.push(p);
      }
    });

    return filtered;
  });

  // Calculates svg lines and return array of { from: coordinate, to: coordinate }
  const lines = computed(() => {
    let _lines: any[] = [];

    fileteredPanels.value.forEach(panel => {
      let from = coordinateToCenterPositionPx(panel.coordinate);
      let to   = coordinateToCenterPositionPx(panel.connection.coordinate);

      _lines.push({
        from: from,
        to: to
      });
    });

    return _lines;
  });

</script>

<template>
  <div>
    <div ref="content_size" style="position:absolute;">
      <table
        :style="{ border: 'none', 'border-collapse': 'collapse' }"
      >
        <tr 
          v-for="row in panelStore.panels.dimention()[1]" 
          :key="`row${row}`"
        >
          
          <td v-for="col in panelStore.panels.dimention()[0]" 
            :style="{ width: boxSize, height: boxSize, padding: '2px' }"
            :key="`col${col}${row}`" 
          >

            <PanelVue :coordinate="{ col: col - 1, row: row - 1 }"/>

          </td>

        </tr>
      </table>
    </div>
    
    <svg style="position: relative; z-index: 1; pointer-events: none;" :width="width" :height="height" v-if="!panelStore.connectionPhase">
      <line
        v-for="(line, i) in lines"
        :key="`line${i}`"
        :x1="line.from.x"
        :y1="line.from.y"
        :x2="line.to.x"
        :y2="line.to.y"
        :stroke="theme.current.value.dark ? 'white' : 'black'"
        stroke-witdh="2px"
      />
    </svg>

    <svg style="position: relative; z-index: 1; pointer-events: none;" :width="width" :height="height" ref="line_svg" v-else>
      <line
        :x1="coordinateToCenterPositionPx(panelStore.connection.from).x"
        :y1="coordinateToCenterPositionPx(panelStore.connection.from).y"
        :x2="elementX"
        :y2="elementY"
        :stroke="theme.current.value.dark ? 'white' : 'black'"
        stroke-witdh="6px"
      />
    </svg>
    
  </div>
</template>
