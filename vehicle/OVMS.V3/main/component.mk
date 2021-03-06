#
# "main" pseudo-component makefile.
#
# (Uses default behaviour of compiling all source files in directory, adding 'include' to include path.)

COMPONENT_ADD_INCLUDEDIRS := .
COMPONENT_ADD_LDFLAGS = -Wl,--whole-archive -l$(COMPONENT_NAME) -Wl,--no-whole-archive -T main/ovms_boot.ld

OVMS_VERSION := MARKFINN_$(shell git describe --always --tags --dirty --exclude "*")_$(shell date --iso-8601=minutes)
CPPFLAGS := -D OVMS_VERSION=\"$(OVMS_VERSION)\" $(CPPFLAGS)

# update OVMS_VERSION dependency file:
ifneq '$(shell cat ovms_version.cfg 2>/dev/null)' '$(OVMS_VERSION)'
.PHONY: ovms_version.cfg
ovms_version.cfg:
	@(echo '$(OVMS_VERSION)' >ovms_version.cfg &)
	@(echo 'Build version is $(OVMS_VERSION)')
endif

ovms_version.o: ovms_version.cfg
