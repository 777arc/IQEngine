// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

function isFolder(file) {
    return file.name.endsWith('/')
  }

export default function GroupByFolder(files, root) {
  const fileTree = {
    contents: [],
    children: {},
  }

  files.map((file) => {
    file.relativeKey = (file.name).substr(root.length)
    let currentFolder = fileTree
    const folders = file.relativeKey.split('/')
    folders.map((folder, folderIndex) => {
      if (folderIndex === folders.length - 1 && isFolder(file)) {
        for (const key in file) {
          currentFolder[key] = file[key]
        }
      }
      if (folder === '') {
        return
      }
      const isAFile = (!isFolder(file) && (folderIndex === folders.length - 1))
      if (isAFile) {
        currentFolder.contents.push({
          ...file,
          keyDerived: true,
          type: 'file',
          name: file.name.split('/').pop(),
        })
      } else {
        if (folder in currentFolder.children === false) {
          currentFolder.children[folder] = {
            contents: [],
            children: {},
            type: 'folder',
          }
        }
        currentFolder = currentFolder.children[folder]
      }
    })
  })

  function addAllChildren(level, prefix) {
    if (prefix !== '') {
      prefix += '/'
    }
    let files = []
    for (const folder in level.children) {
      console.log('children');
      console.log(folder);
      files.push({
        ...level.children[folder],
        contents: undefined,
        keyDerived: true,
        name: folder,
        relativeKey: prefix + folder + '/',
        children: addAllChildren(level.children[folder], prefix + folder),
      })
    }
    files = files.concat(level.contents)
    return files
  }

  files = addAllChildren(fileTree, '')
  return files
}
