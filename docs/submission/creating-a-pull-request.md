---
description: Submitting your code to Seam so that it can go live to everyone
---

# Creating a Pull Request

Once you are happy with your miniapp, it's time to create a [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) so your miniapp can go live on [seam.so](https://www.seam.so) and the Seam mobile app.

_A pull request is a proposal to merge a set of changes from one branch into another. In a pull request, collaborators can review and discuss the proposed set of changes before they integrate the changes into the main codebase. Pull requests display the differences, or diffs, between the content in the source branch and the content in the target branch. --_ [Github documentation on Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

### Before you Submit

To help your pull request go as smoothly as possible, review the steps listed below that can slow down a review. Make sure you:

* Test your miniapp for crashes and bugs!
* Remove all `console.log` statements, commented code, and unused code. Remember, your miniapp will live open source as an example for new developers who come behind you!
* Make sure your miniapp works on phone sizes as well as desktop sizes. See [Supporting Mobile](../miniapp-creation/supporting-mobile.md) for more.
* Don't include any large new dependencies that would slow down the entire Seam loading experience.

We'll accept any miniapps that are genuine and fun and come from your own imagination. We strongly support all points of view being represented on Seam, as long as the miniapps are respectful to users with differing opinions and the quality of the miniapp is great. We won't merge any miniapps for any content or behavior that we believe is over the line.

### Making the Submission: Creating a Pull Request from a Fork

1. Navigate to the original repository where you created your fork.
2.  Above the list of files, in the yellow banner, click **Compare & pull request** to create a pull request for the associated branch.

    ![Screenshot of the banner above the list of files.](https://docs.github.com/assets/cb-34097/images/help/pull\_requests/pull-request-compare-pull-request.png)
3.  On the page to create a new pull request, click **compare across forks**.

    ![Screenshot of the page to open a pull request. The "compare across forks" link is outlined in dark orange.](https://docs.github.com/assets/cb-41260/images/help/pull\_requests/compare-across-forks-link.png)
4.  In the "base branch" dropdown menu, select the branch of the upstream repository you'd like to merge changes into.

    ![Screenshot of the page to open a new pull request. The dropdown menus for choosing the base repository and branch are outlined in dark orange.](https://docs.github.com/assets/cb-96536/images/help/pull\_requests/choose-base-fork-and-branch.png)
5.  In the "head fork" dropdown menu, select your fork, then use the "compare branch" drop-down menu to select the branch you made your changes in. Likely, this will be the `main` branch of your fork.

    ![Screenshot of the page to open a new pull request. The dropdown menus for choosing the head repository and compare branch are outlined in dark orange.](https://docs.github.com/assets/cb-96331/images/help/pull\_requests/choose-head-fork-compare-branch.png)
6. Type a title and description for your pull request, like: `[Miniapp Name Submission]: Description of miniapp`.
7. Make sure to select **Allow edits from maintainers** checkbox, as this will allow the Seam team to help clean up and get your miniapp ready to ship.
8. To create a pull request that is ready for review, click **Create Pull Request**. To create a draft pull request, use the drop-down and select **Create Draft Pull Request**, then click **Draft Pull Request**.

You can learn more about Pull Requests using the [documentation on Github](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request#changing-the-branch-range-and-destination-repository).

### Seam Team Review

Once your Pull Request is created, the Seam team will review the code and functionality of your miniapp. This [code review](https://about.gitlab.com/topics/version-control/what-is-code-review/) is an important part of making sure that all miniapps follow best practices for performance and code quality, so they are examples everyone else can follow in the future.

Keep an eye out for Requests for Changes, and you'll need to make sure to address the comments and update your code before the miniapp ships. Once the code is looking good, the Seam Team will accept the Pull Request and merge it into the main branch of the miniapp repository, and it will ship in the next release of the Seam app.

