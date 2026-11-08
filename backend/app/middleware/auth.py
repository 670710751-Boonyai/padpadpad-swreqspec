"""Helpers for session-based applicant identity in the camp enrollment flow."""

from fastapi import HTTPException, Request, status


def bind_session_user(request: Request, user_id: str) -> None:
    """Bind an identity supplied by trusted authentication code to the session."""
    request.state.user_id = user_id
    session = getattr(request, "session", None)
    if session is not None:
        session["user_id"] = user_id


def get_current_user_id(request: Request) -> str:
    """Get applicant identity only from the verified session cookie (CON-ENR-02, NFR-SEC-01)."""
    session = request.scope.get("session")
    session_user = session.get("user_id") if isinstance(session, dict) else None
    if isinstance(session_user, str) and session_user.strip():
        return session_user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required for camp enrollment actions.",
    )
