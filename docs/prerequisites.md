# Getting Started

## Prerequisites

Before integrating Stream Assistant into your media workflow, ensure that the following prerequisites are satisfied:

### Media Library Requirements
- A comprehensive media library with a minimum runtime of 24 hours, encompassing television shows or movies.
- For streams utilizing the broadcast emulation option, it is recommended to include:
  - 30 minutes of commercial content
  - 30 minutes of music videos
  - 30 minutes of short films

### System Requirements
- Operating System: Windows
- Essential Software:
  - VLC for media playback
  - MongoDB for database operations
  - Node.js

## Installation

Follow these steps to set up Stream Assistant:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/stream-assistant.git
   cd stream-assistant
   ```

2. **Install Dependencies:**
        Ensure VLC, MongoDB, and Node.js are installed on your system.
        Install Node.js dependencies:

    ```bash
    npm install
    ```

3. **Configuration:**

    Modify the config.json file to specify details such as media library path, database connection, and other preferences.

3. **Run Stream Assistant:**

    ```bash
    npm start
    ```

## Usage

Once installed, Stream Assistant offers the following functionality:

    - Procedural Streaming:
        - Customize streaming preferences by adjusting settings in the config.json file.

    - Broadcast Emulation:
        - For a simulated broadcast experience, configure time slots and ensure the media library meets the recommended content durations.

Refer to the Configuration section for detailed customization options.