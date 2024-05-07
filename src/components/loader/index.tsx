import loadingIamge from '../../images/loadingIcon.png';
import './style.css';

const Loader = () => (
        <div className='loaderWrapper'>
            <img alt="loader" src={loadingIamge} />
        </div>
        );

export default Loader;