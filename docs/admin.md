# Administration

MiniCMS aims to make the contest administration process as simple as possible, from creating and modifying challenges to rejudging and making announcements in contest. This document describes how to carry out common administrative tasks and some of the design decisions made while creating MiniCMS.

## Philosophy

### Completed contests are closed

Any completed contest is closed to modification, and generally its results will not be changed by edits. However, changes made in ongoing contests may trigger rejudging if required.

### New submissions are prioritised over rejudging

Rejudging can occur after the contest closes, so new submissions will take priority in the judging queue. Rejudging only occurs if no new submissions are queued.

## Modifying challenges

### Effect on submissions made in a completed contest

If there are existing submissions for the challenge in a completed contest (i.e. one where the end date is passed) then results from these submissions are not changed. However, future viewers of the challenge in that contest will see the updated version, and future submissions will use the updated test cases.

If rejudging is desired on a past contest, manual rejudging can be triggered.

### Effect on submissions made in an ongoing contest

If there are existing submissions for the challenge in a current contest (i.e. one where the end date is not passed) and changes are made to the tasks or tests, then MiniCMS will ask if rejudging is required. If so, rejudging is carried out on all such submissions. Note that submissions from completed contests are not rejudged as per the above section.
