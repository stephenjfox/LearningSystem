JJ AGENT GUIDELINES
===================

Purpose
-------
This file defines how automated agents must use the Jujutsu (jj) version
control system in this repository. It encodes:

- The mental model of jj.
- The expected workflow for this project.
- Safety rules to avoid data loss or history damage.
- A quick command reference.

If you are an AI agent, follow these rules exactly unless explicitly told
otherwise in the current task instructions.


1. JJ MENTAL MODEL (READ FIRST)
--------------------------------

1.1 Working copy is a commit
- In jj, the "working copy" is itself a commit, referred to as "@". There is
  no separate staging area. [page:0]
- When files are edited and a jj command is run, jj automatically snapshots
  the working directory and amends "@". [page:0]
- You never run "git add". Assume that edits are always part of "@". [page:0]

1.2 Change IDs vs Commit IDs
- JJ tracks two identifiers:
  - Change ID: logical unit of work that stays stable when you amend. [page:0]
  - Commit ID: concrete snapshot identifier that changes on each amendment. [page:0]
- When referring to “the work I am doing,” prefer change IDs or bookmarks.
  When you need a precise historical snapshot, use commit IDs. [page:0]

1.3 Bookmarks instead of “current branch”
- JJ has bookmarks that behave like moving labels on commits. [page:0]
- There is no single “current branch” like in Git; you work with commits and
  bookmarks explicitly.
- This project uses bookmarks as the primary way to name lines of work.


2. REPO AND WORKSPACE CONVENTIONS
---------------------------------

2.1 Repository layout (example)
- Shared JJ+Git repo root: /PATH/TO/PROJECT_REPO
- Workspaces (one per agent):
  - /PATH/TO/workspaces/agent-a
  - /PATH/TO/workspaces/agent-b
  - /PATH/TO/workspaces/agent-c
- All workspaces share one underlying JJ repository but have separate working
  directories.

(Replace the paths above with the real ones for this project.)

2.2 Creating workspaces (human-only setup step)
A human operator should create workspaces once, for example:

  # Run in the shared repo root
  jj workspace add /PATH/TO/workspaces/agent-a
  jj workspace add /PATH/TO/workspaces/agent-b
  jj workspace add /PATH/TO/workspaces/agent-c

After that, agents must not add or delete workspaces unless explicitly
instructed.

2.3 Per-agent bookmarks (example convention)
- Each agent works primarily on its own bookmark namespace:
  - agent-a/* for agent A (e.g., agent-a/main, agent-a/feature-x)
  - agent-b/* for agent B
  - agent-c/* for agent C
- A human or a dedicated “merge agent” handles merging into shared bookmarks
  like main or release/*.


3. REQUIRED SAFETY HABITS
-------------------------

The following rules are mandatory for all agents.

3.1 Always orient before acting
Before running any modifying command:

  - Run: jj status
  - Run: jj log -r @

Verify:
  - You are in the correct workspace directory for your agent.
  - The bookmark and commit you are about to modify are expected.

3.2 Workspace isolation
- Each agent must operate only in its assigned workspace directory.
- Never read or write files, or run jj commands, in another agent’s workspace.
- Never assume a workspace’s state; always inspect with jj status and jj log.

3.3 Bookmark discipline
- Prefer working on bookmarks within your namespace (e.g., agent-a/*).
- Do not move or delete bookmarks outside your namespace (e.g., main, other
  agents’ bookmarks) unless explicitly instructed.
- When creating bookmarks, use clear names that include the agent prefix and
  a brief purpose, e.g., agent-a/fix-auth-logging.

3.4 History-editing commands require extra care
Commands like rebase, squash, abandon, split, and parallelize change history
shape. [page:0]

Rules:
- Only run these on:
  - Your own bookmarks, or
  - Temporary feature branches, as explicitly instructed.
- Never run them on:
  - main or other trunk-like bookmarks,
  - release/* bookmarks,
  - bookmarks owned by other agents,
  unless explicitly instructed.

3.5 Use the safety net when something looks wrong
- JJ keeps an operation log and supports undo. [page:0]
- If a command had unexpected effects or you are unsure about the new state:
  - Immediately run: jj op log
  - Then run: jj undo
- Do not attempt to "fix" an unexpected state with more history-editing
  commands; first undo back to a known-good state.


4. BASIC WORKFLOW FOR AGENTS
----------------------------

This section describes the minimal, safe workflow an agent should use.

4.1 Starting work from main
Typical pattern:

  # Ensure workspace is clean and up to date
  jj status         # confirm no unwanted changes
  jj git fetch      # get remote updates
  jj rebase -d main@origin   # rebase local work onto latest main (if needed)

  # Start a new logical change
  jj new main@origin            # base new work on remote main
  jj describe -m "agent-a: short description"
  # ... edit files ...
  # Edits are auto-amended into @

When ready to “finish” the current change and start another:

  jj commit -m "agent-a: detailed summary of change"
  # This sets the message for @ and creates a new empty commit on top. [page:0]

4.2 Creating and updating bookmarks
Attach or move a bookmark to the current change:

  jj bookmark set agent-a/feature-x -r @

View bookmarks:

  jj bookmark list

Never delete or move bookmarks outside your agent’s namespace unless
explicitly instructed.

4.3 Syncing with Git remotes
Fetch remote changes:

  jj git fetch

Push your bookmark:

  jj git push --bookmark agent-a/feature-x --allow-new   # first push
  jj git push --bookmark agent-a/feature-x               # subsequent pushes

If push fails due to remote changes:
  - Run: jj git fetch
  - Rebase onto the updated remote bookmark (e.g., main@origin).
  - Retry the push.

4.4 Making small follow-up edits
If you need to update the most recent change:

  # You are already at @ for that change
  # ... edit files ...
  jj describe -m "agent-a: updated message if needed"
  # Optionally: jj commit -m "..." to start a new change on top.

If you need to fix an earlier change in your own stack:

  jj edit <change-id>    # move working copy to that change
  # ... edit files ...
  jj new                 # continue forward; descendants auto-rebase. [page:0]


5. CONFLICT HANDLING RULES
--------------------------

5.1 When rebase or merge creates conflicts
JJ allows commits with unresolved conflicts and does not require special
"continue" commands. [page:0]

Standard procedure:
  - Run: jj status          # see which files are conflicted
  - For each conflicted file:
      - Edit it to resolve conflicts, or
      - Run: jj resolve path/to/file

After edits:
  - Run: jj diff            # verify the resolution
  - Once the code builds/tests, continue work as normal.

5.2 When not to postpone conflicts
Do not leave conflicts unresolved if:
  - You are about to push changes.
  - You are about to request review.
  - You are switching to work on dependent changes.

If unsure, resolve conflicts immediately.


6. WORKSPACE SAFETY RULES (PROJECT-SPECIFIC)
--------------------------------------------

This section should be customized by the project owner. Defaults are below.

6.1 Workspace ownership
- Each workspace is logically owned by exactly one agent (or human).
- Only the owning agent or human may:
  - Change bookmarks whose names start with that owner’s prefix.
  - Run history-editing commands on changes reachable only from that owner’s
    bookmarks.

6.2 Allowed operations in a workspace
The following commands are generally safe in any workspace, if scoped to the
owner’s bookmarks and changes:

  - jj status
  - jj diff
  - jj log / jj evolog / jj interdiff
  - jj new / jj commit / jj describe
  - jj file * commands
  - jj bookmark set/create/list on the owner’s prefix
  - jj git fetch / jj git push for the owner’s bookmarks
  - jj resolve / manual conflict editing
  - jj undo / jj op log / jj op restore (within the workspace)

Use history-editing commands (squash, split, rebase, abandon, parallelize,
absorb, diffedit, duplicate) only when:
  - You are acting on your own bookmarks, AND
  - The instructions explicitly allow history rewriting, OR
  - You are operating on unpushed local work.

6.3 Disallowed operations (unless explicitly instructed)
- Deleting or moving main or other trunk-like bookmarks.
- Deleting or moving other agents’ bookmarks.
- Deleting workspaces.
- Running git commands that rewrite history (e.g., git rebase, git reset)
  inside a colocated jj repo. Use jj instead.


7. QUICK COMMAND REFERENCE (FOR AGENTS)
---------------------------------------

This is a minimal subset of jj commands agents are allowed to rely on.
For details, use built-in help (jj help <command>). [page:0][web:33]

State and inspection
- jj status
  - Show current working copy changes and conflict status.

- jj diff
  - Show changes in the current working commit (@).

- jj log
  - Show commit graph; with -r <revset> to restrict.

- jj evolog
  - Show how a change evolved through amendments.

Creating and finishing changes
- jj new
  - Finish current change and start a new empty commit on top.

- jj describe -m "message"
  - Set or update the commit message for the current change.

- jj commit -m "message"
  - Describe current change and start a new empty change on top
    (similar to git commit). [page:0]

Navigation
- jj edit <change-id>
  - Switch working copy to an existing change to continue editing it.

- jj prev / jj next
  - Move to parent / child in a linear stack.

Bookmarks and sync
- jj bookmark set NAME -r @
  - Create or move bookmark NAME to the current change.

- jj bookmark list
  - List local and remote bookmarks.

- jj git fetch
  - Fetch from Git remote(s).

- jj git push --bookmark NAME [--allow-new]
  - Push bookmark NAME to the remote.

History editing (use only when allowed)
- jj squash
  - Fold the current change into its parent.

- jj split
  - Interactively split the current change into two.

- jj rebase -d DEST
  - Rebase the current change onto DEST.

Conflicts and safety
- jj resolve [PATH]
  - Inspect and resolve conflicts, optionally for a specific file.

- jj undo
  - Undo the last jj operation.

- jj op log
  - Show the operation log.

- jj op restore <op-id>
  - Restore repo state to a previous operation.

If you are unsure which command to use, prefer:
  - Inspecting state (status, diff, log) over mutating history.
  - Asking for explicit human instructions over guessing.


8. EXTERNAL REFERENCES (FOR HUMANS / SUPERVISING SYSTEMS)
---------------------------------------------------------

These URLs are provided for supervising humans or higher-level systems that
may want deeper context. Agents do not need to read them directly.

- Comprehensive JJ tutorial and cheatsheet: [page:0]
- Conceptual JJ tutorial by Steve Klabnik: [page:1]
- Official JJ CLI reference: [web:33]

End of JJ Agent Guidelines.

