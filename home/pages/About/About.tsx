import React, { useState } from 'react'
import { observer } from 'mobx-react-lite';


interface IAboutProps {
}


export default observer(function (props: IAboutProps) {
    let title = 'About Me';

    return <h2>{title}</h2>
})
