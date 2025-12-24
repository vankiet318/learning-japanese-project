@router.get("/{kana_type}")
def list_kana(kana_type: str, db: Session = Depends(get_db)):
    return db.query(Kana).filter(Kana.type == kana_type).all()
