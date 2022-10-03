// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useState } from "react";
import FileRow from "./File";
import styled from "styled-components";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpen from "@mui/icons-material/FolderOpen";

const StyledOpenFolderIcon = styled(FolderOpen)`
    color: orange;
    vertical-align: bottom;
    font-size: 20px!important;
    margin-right: 4px;
`;

const StyledFolderIcon = styled(FolderIcon)`
    color: orange;
    vertical-align: bottom;
    font-size: 20px!important;
    margin-right: 4px;
`;


const Directory = ({ id, files }) => {
    const [isExpanded, toggleExpanded] = useState(false);
    if (files.type === 'folder') {
        return (
            <>
                <tr key={id}>
                    <td className="align-middle">
                        <p onClick={() => toggleExpanded(!isExpanded)}>
                            {
                                isExpanded ? <StyledOpenFolderIcon /> : <StyledFolderIcon />
                            }
                        {files.name}</p>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                {
                    isExpanded && files.children.map((item) => <Directory id={id+1} files={item} />)
                }
            </>
        )
    }
    return (
        <>
            <FileRow key={id} info={files} />
        </>
    )
}

export default Directory;