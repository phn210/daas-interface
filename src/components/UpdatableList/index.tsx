import { GovernorBaseConfig, GovernorConfig, TimelockConfig } from 'src/contexts/daos-context/types';

type Props = {
    data: string | GovernorBaseConfig | GovernorConfig | TimelockConfig;
}

export default function UpdatableList(props: Props) {
    const list = props.data;
    
    return (
        <></>
    );
}