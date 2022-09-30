from typing import Any, Iterable, List, Mapping, Optional, Sequence, Tuple, Union

class AzureSigMFError(Exception):
    """Base class for all AzureSigMF exceptions."""

    def __init__(self, message: str = "", error_labels: Optional[Iterable[str]] = None) -> None:
        super(AzureSigMFError, self).__init__(message)
        self._message = message
        self._error_labels = set(error_labels or [])

    def has_error_label(self, label: str) -> bool:
        """Return True if this error contains the given label.

        """
        return label in self._error_labels

    def _add_error_label(self, label):
        """Add the given label to this error."""
        self._error_labels.add(label)

    def _remove_error_label(self, label):
        """Remove the given label from this error."""
        self._error_labels.discard(label)

    @property
    def timeout(self) -> bool:
        """True if this error was caused by a timeout.

        """
        return False

class OptimisticConcurrencyError(AzureSigMFError):
    """Raised for failures related document updates."""

class ExpectedDocumentNotFoundError(AzureSigMFError):
    """Raised for failures related document updates."""