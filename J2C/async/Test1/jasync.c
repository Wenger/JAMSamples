#include <stdio.h>

int i = 0;
long long qtime = 0;

jasync ping() {

  printf("In ping...i = %d\n", i);

  /*  
  i = i + 1;
  if (i % 1000 == 0)
    {

      if (qtime == 0)
	qtime = activity_getseconds();
      else
	{
	  long long now = activity_getseconds();
	  long diff = now - qtime;
	  qtime = now;
	  printf("Rate: %f per second\n", (1000.0 * 1000000.0)/diff);
	}
    }
  printf("fsdfsdfsdf \n");
  */
}

int main() 
{
  printf("C program started... \n");
}
