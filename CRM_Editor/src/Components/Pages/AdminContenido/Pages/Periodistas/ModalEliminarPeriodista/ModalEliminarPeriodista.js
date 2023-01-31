import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

//ACTION
import { Modal } from 'rsuite';

const ModalEliminarPeriodista = (props) => {
    const data3 = props.dataModalEliminarPeriodista;
    const [open, setOpen] = useState(data3 != null);
    const [backdrop, setBackdrop] = useState('static');
    const handleClose = () => setOpen(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (data3 != null) {
            setOpen(data3);
        }
    }, [data3])

    const handleEliminarPeriodista = () => {
        const dataEliminar = {

        }
        if (dataEliminar != null) {
            //dispatch(setEstadoSolicitud(dataEliminar));
        }
        setOpen(false);
    }
    return (
        <>
            {(open) &&
                <Modal className='proyecto-modal infoModal' backdrop={backdrop} open={open} size="md" onClose={handleClose} >
                    <Modal.Header className='headerModal'>
                        <Modal.Title className='headerModal'>
                            <div>
                                <h4 style={{ margin: 'auto', color: 'white', textAlign: 'center' }}> ¡Mensaje Importante! </h4>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='textModal'>
                            ¿Desea eliminar este periodista de su lista?
                            <p> {data3.idPeriodista} </p>
                            <p> {data3.idPeriodista} </p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='contFooter'>
                        <button className='buttonModal' onClick={handleEliminarPeriodista}> Aceptar </button>
                        <span style={{ padding: '10px' }}></span>
                        <button className='buttonModal' onClick={handleClose}> Cancelar </button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
}

export default ModalEliminarPeriodista;
