HLS Streaming / JavaScript Debugging Exercises - Submission
---
For this exercise, I chose the `Query an Ordered List` problem from the `General Programmer Problems` section, and I chose the `Memory Leak Problem` from the `Player Debugging` section.

### Structure of this Submission
In this repo, you will find that the structure of the project has not changed from what was provided. *However*, each solution is contained in a different branch. I will list the branches below. ***Please go to the respective branches for the solutions, as they are not here in `master`***:

#### For the `Memory Leak Problem` submission, there is only one branch:
- `memory_leak_fix`
    - Maximum page memory for the test never exceeded `110MB` before garbage collection would free memory, usually dropping the memory usage for the page back down around `~25MB`

#### For the `Query an Ordered List` submission, there are three branches:
- `App-Binary-Search_No-Sharding` - The branch containing the solution without trying the bonus problem. The logged runtime for 20 million records is:
```
{
    "min": 158,
    "max": 263,
    "average": 243
}
```
- `App-Binary-Search_DB-Sharding` - The branch that contains my attempt at database sharding for the bonus problem. The logged runtime for 20 million records and 13 shards is:
```
{
    "min": 188,
    "max": 230,
    "average": 211
}
```
- `DB-Binary-Search_DB-Sharding` - An additional attempt at shortening the runtime by offloading all database seeking to the database server and making a single call from the application server per position. The application server passes the position to the database server, and the database seeks and returns the segment that contains the provided position, if it exists. The logged runtime for 20 million records and 13 shards is:
```
{
    "min": 12,
    "max": 18,
    "average": 12
}
```
