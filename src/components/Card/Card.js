import React, { useState, useContext } from 'react';
import ContentLoader from 'react-content-loader';
import AppContext from '../../context';

import styles from './Card.module.scss';

// added={isItemAdded(item && item.id)}

const Card = ({
    id,
    onFavorite,
    image,
    name,
    price,
    onPlus,
    favorited = false,
    loading = false,
}) => {
    const [isFavorite, setisFavorite] = useState(favorited);
    const { isItemAdded } = useContext(AppContext);
    const obj = { id, parentId: id, name, image, price };

    const onClickPlus = () => {
        onPlus(obj);
    };

    const onClickFavorite = () => {
        onFavorite(obj);
        setisFavorite(!isFavorite);
    };

    return (
        <div className={styles.card}>
            {loading ? (
                <ContentLoader
                    speed={2}
                    width={155}
                    height={230}
                    viewBox="0 0 155 230"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <rect x="0" y="0" rx="0" ry="0" width="150" height="120" />
                    <rect x="0" y="131" rx="5" ry="5" width="150" height="15" />
                    <rect x="0" y="154" rx="5" ry="5" width="100" height="15" />
                    <rect x="0" y="200" rx="5" ry="5" width="80" height="25" />
                    <rect
                        x="118"
                        y="195"
                        rx="10"
                        ry="10"
                        width="32"
                        height="32"
                    />
                </ContentLoader>
            ) : (
                <>
                    <div onClick={onClickFavorite} className={styles.favorite}>
                        <img
                            src={
                                isFavorite
                                    ? '/img/heart-active.svg'
                                    : '/img/heart-disactive.svg'
                            }
                            alt="heart"
                        />
                    </div>
                    <img width={133} height={112} src={image} alt="sne" />
                    <h5>{name}</h5>
                    <div className="d-flex justify-between align-center">
                        <div className="d-flex flex-column">
                            <p>Цена:</p>
                            <b>{price} руб.</b>
                        </div>
                        <img
                            className={styles.plus}
                            onClick={onClickPlus}
                            src={
                                isItemAdded(id)
                                    ? '/img/checked.svg'
                                    : '/img/plus.svg'
                            }
                            alt="plus"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Card;
