#!/bin/zsh
set -e
for topic in home aes learn compare glossary; do
  route="/$topic"
  if [[ "$topic" == home ]]; then route="/"; fi
  mise exec node@22.23.1 -- npx --yes lighthouse@13.4.1 "http://127.0.0.1:4173$route" --chrome-path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --chrome-flags='--headless' --output=json --output-path="../design-research/lighthouse-$topic-final.json" --quiet
  echo "Measured $topic"
done
