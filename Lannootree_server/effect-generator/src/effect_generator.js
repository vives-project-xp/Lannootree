import EffectsToGif from './effects_to_gif.js';

const manager = new EffectsToGif;
manager.generate_gifs([10, 10], 10);  // see README

/*
The effect generator works and generates gifs, but it isn't complete yet.
This should also run in docker and should send the gifs over MQTT to the voronoi-api (on command from the controller) so it can processes them.
After that, the processed effects will be sent to storage (handled by the voronoi-api)
*/