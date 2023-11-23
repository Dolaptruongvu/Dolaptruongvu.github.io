using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class HealthBar : MonoBehaviour
{
    public Image FillBar;
    public TextMeshProUGUI textMesh;

    public void UpdateBar(int currentHealth, int maxHealth)
    {
        
        FillBar.fillAmount = (float)currentHealth / (float)maxHealth;
        textMesh.text = currentHealth.ToString() + " / " + maxHealth.ToString();
    }
}
