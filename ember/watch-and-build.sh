#!/bin/sh
while inotifywait -r -e modify --exclude '\.(swp|swo|css|scss)' .; do
	ember build
done
