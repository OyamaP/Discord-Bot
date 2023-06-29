class Dropbox {
  async filesSearchV2() {
    const metadata = {
      metadata: {
        name: 'test_filename.jpg',
        path_display: '/123456789001010101/test_filename.jpg',
      },
    };

    return {
      result: {
        matches: [{ metadata }],
      },
    };
  }

  async sharingListSharedLinks() {
    const url = 'https://www.dropbox.com/s/testdir/test_filename.jpg?dl=0';

    return {
      result: {
        links: [{ url }],
      },
    };
  }

  async sharingCreateSharedLinkWithSettings() {
    const url = 'https://www.dropbox.com/s/testdir/test_filename.jpg?dl=0';

    return {
      result: { url },
    };
  }
}

export { Dropbox };
