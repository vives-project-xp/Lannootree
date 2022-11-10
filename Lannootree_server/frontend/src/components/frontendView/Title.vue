<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div>
    <h1 class="green">{{ msg }}</h1>
    <h3>
      Welcome to the
      <a href="https://github.com/vives-project-xp/Lannootree" target="_blank" rel="noopener">Lannootree project</a>.
    </h3>
  </div>
</template>

<style scoped>
  h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
  }

  h3 {
    font-size: 1.2rem;
  }

  .title h1,
  .title h3 {
    text-align: center;
  }

  .green {
    text-decoration: none;
    color: #00bd7e;
    transition: .4s;
  }

  a, .green {
	text-decoration: none;
	color: #00bd7e;
	transition: .4s;
}
</style>
