#!/bin/sh
sass --watch --debug-info css/style.scss &
while inotifywait -r -e modify --exclude '\.(swp|swo|css|scss)' .; do
	ember build
done
