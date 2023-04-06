import {useState} from "react";
import { Dock } from 'rc-dock';

const Docks = () => {
    const panels = [
        { id: 'panel1', title: 'Panel 1', content: 'Content of panel 1' },
        { id: 'panel2', title: 'Panel 2', content: 'Content of panel 2' },
        { id: 'panel3', title: 'Panel 3', content: 'Content of panel 3' },
    ];

    const dockConfig = {
        dockbox: {
            mode: 'horizontal',
            children: [
                {
                    mode: 'vertical',
                    size: 200,
                    children: [
                        { id: 'panel1', size: 100 },
                        { id: 'panel2', size: 100 },
                    ],
                },
                { id: 'panel3', size: 100 },
            ],
        },
    };
    const [layout, setLayout] = useState(dockConfig);

    return (
       <Dock
           defaultLayout={layout}
           onLayoutChange={(newLayout) => setLayout(newLayout)}
           panels={panels}
       />
    )
}

export default Docks