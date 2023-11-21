#include <cstdio>

int N, a, sum;

int main() {
  scanf("%d", &N);

  for (int i = 0; i < N; i++) {
    scanf("%d", &a);
    sum += a;
  }

  printf("%d", sum);
}