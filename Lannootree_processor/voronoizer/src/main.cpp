#include <voroniozer.hpp>
#include <voronoizer-aruments.hpp>

int main(int argc, char* argv[]) {
  Processing::VoronoizerArguments args(argc, argv);

  Processing::Voronoizer voroizer(args.get_frame_provider(), args.get_formatter(), "./config.json");
  voroizer.start(args.get_thread_count());

  return 0;
}
