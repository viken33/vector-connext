#!/usr/bin/env bash
set -e

root=$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )
project=$(grep -m 1 '"name":' "$root/package.json" | cut -d '"' -f 4)

# make sure a network for this project has been created
docker swarm init 2> /dev/null || true
docker network create --attachable --driver overlay "$project" 2> /dev/null || true

####################
## Load Config

# Load the config with defaults if it does not exist
if [[ ! -f "$root/browser.config.json" ]]
then cp "$root/ops/config/browser.default.json" "$root/browser.config.json"
fi

config=$(cat "$root/browser.config.json")

# If file descriptors 0-2 exist, then we're prob running via interactive shell instead of on CD/CI
if [[ -t 0 && -t 1 && -t 2 ]]
then interactive=(--interactive --tty)
else echo "Running in non-interactive mode"
fi

docker run \
  "${interactive[@]}" \
  --entrypoint="bash" \
  --env="SKIP_PREFLIGHT_CHECK=true" \
  --env="REACT_APP_VECTOR_CONFIG=$config" \
  --name="${project}_browser_node" \
  --publish="3333:3000" \
  --network "$project" \
  --rm \
  --tmpfs="/tmp" \
  --volume="$root:/app" \
  "${project}_builder" -c "cd ./modules/test-ui && npm start"
