# Asset Processor

- calculates and processes the assets.
- Connects to the asset api in the main controller.

<https://www.metadata2go.com/>
<https://hub.docker.com/r/mikenye/youtube-dl>

# Voronoi

**Only .gif is supported at the moment**

I recomend using a conda environment, you can find my exported conda environment [here](./voronoi_env.yml).

### Import conda env

```bash
conda env create -n ENVNAME --file /path/to/voronoi_env.yml
```

## Running script

### Arguments

| Argument | Alternate | Function                 | Required          |
|----------|-----------|--------------------------|-------------------|
| -i       | --image   | Path to image file       | True              |
| -c       | --config  | Path to config.json file | False (temporary) |

### Execution

```bash
python3 /path/to/voronoizer.py -i /path/to/img.gif
```

A directory img_processed will be created in directory of exectution, where a preview of the processed image will be stored as processed_{FILENAME}.
