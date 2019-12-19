#
# This is a project Makefile. It is assumed the directory this Makefile resides in is a
# project subdirectory.
#

PROJECT_NAME := ovms3

.PHONY: app-ota h2

h2: help
	echo
	echo or app-ota for mark stuff
	echo
	
app-ota: app build/ovms3.bin
	scp build/ovms3.bin leaf:/sd/devovms3.bin
	ssh leaf "ota status"
	ssh leaf "ota flash vfs /sd/devovms3.bin"
	ssh leaf "ota status"
	ssh leaf "module reset"



include $(IDF_PATH)/make/project.mk


