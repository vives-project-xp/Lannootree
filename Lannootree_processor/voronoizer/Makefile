CC=g++
CFLAGS=-c -Bstatic -static -static-libgcc -static-libstdc++ -Wall -std=c++17 -O2 -s -DNDEBUG -mno-needed

IM_CXXFLAGS=$(shell Magick++-config --cxxflags)
IM_LDFLAGS=$(shell Magick++-config --ldflags)

OPENCV=$(shell pkg-config --cflags --libs --static opencv4)
GTK=$(shell pkg-config --cflags --libs --static gtk+-2.0)
REDIS=/usr/local/lib/libredis++.a /usr/lib/x86_64-linux-gnu/libhiredis.a

# Libraries
LIBS=$(OPENCV) $(GTK) $(REDIS)

# Name of executable output
TARGET=voronoizer
SRCDIR=src
BUILDDIR=bin

OBJS := $(patsubst %.cpp,%.o,$(shell find $(SRCDIR) -name '*.cpp'))

all: makebuildir $(TARGET)

$(TARGET) : $(OBJS)
	$(CC) $(LDFLAGS) -o $(BUILDDIR)/$@ $(OBJS) $(LIBS)

%.o : %.cpp
	$(CC) $(CFLAGS) $< -o $@

clean :
	rm -rf $(BUILDDIR)
	rm -f $(OBJS)

makebuildir:
	mkdir -p $(BUILDDIR)
