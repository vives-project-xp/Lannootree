#include <lannootree.hpp>

int main(int argc, char* argv[]) {
  log(logo);

  std::ifstream f("../test.json");
  Lannootree::LannooTree lannootree(f);
  
  return 0;
}
